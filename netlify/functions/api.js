import { randomBytes, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { tmpdir } from "node:os";

const outfitTypes = new Set([
  "Blouse",
  "Kurti",
  "Top",
  "Tunic",
  "Suit Upper",
  "Peplum",
  "Crop Top",
  "Jacket",
  "Other",
]);

let database;
function getDatabase() {
  if (database) return database;
  const dbPath = process.env.DB_PATH || resolve(tmpdir(), "khwab_orders.sqlite");
  mkdirSync(dirname(dbPath), { recursive: true });
  database = new DatabaseSync(dbPath);
  database.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS orders (
      order_id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      value TEXT NOT NULL
    );
  `);
  return database;
}

function validText(value, maxLength) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

function validateOrder(order) {
  if (!order || typeof order !== "object" || Array.isArray(order)) return "Order details are missing.";
  if (
    !order.customer ||
    !validText(order.customer.name, 120) ||
    !validText(order.customer.whatsapp, 40) ||
    !validText(order.customer.cityState, 160) ||
    !validText(order.customer.pin, 20)
  ) {
    return "Please provide a name, WhatsApp number, city, and PIN code.";
  }
  if (!validText(order.outfit?.type, 40) || !outfitTypes.has(order.outfit.type)) {
    return "Please select a valid outfit.";
  }
  if (!validText(order.delivery?.address, 1000)) return "Please enter a delivery address.";
  return null;
}

function adminAuthorized(headers) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const authHeader = headers.authorization || headers.Authorization || "";
  const supplied = Buffer.from(authHeader.replace(/^Bearer\s+/i, ""));
  const expected = Buffer.from(adminPassword);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function csvCell(value) {
  let text = value == null ? "" : String(value);
  if (/^[\s]*[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function orderCsv(orders) {
  const headers = [
    "Order ID", "Submitted At", "Customer Name", "WhatsApp", "Email", "City & State", "PIN",
    "Outfit", "Pieces", "Design Code", "Reference Photo", "Special Requests",
    "Front Neck", "Back Neck", "Sleeve Length", "Sleeve Design", "Fit", "Design Notes",
    "Measurement Unit", "Measurement Method", "Measurements",
    "Delivery Address", "Landmark", "Delivery Type", "Payment Mode",
  ];
  const rows = orders.map((order) => [
    order.orderId, order.createdAt, order.customer.name, order.customer.whatsapp,
    order.customer.email, order.customer.cityState, order.customer.pin,
    order.outfit.type, order.outfit.pieces, order.outfit.designCode, order.outfit.refPhoto,
    order.outfit.specialReq, order.design.neckFront, order.design.neckBack,
    order.design.sleeveLength, order.design.sleeveDesign, order.design.fit,
    order.design.additionalInstructions, order.measurements.unit,
    order.measurements.provideMethod, JSON.stringify(order.measurements.values),
    order.delivery.address, order.delivery.landmark, order.delivery.deliveryType,
    order.delivery.paymentMode,
  ]);
  return `\uFEFF${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
}

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

export async function handler(event) {
  const method = event.httpMethod || "GET";
  let pathname = (event.path || "/")
    .replace(/^\/\.netlify\/functions\/api/, "")
    .replace(/^\/api/, "");
  if (!pathname.startsWith("/")) pathname = "/" + pathname;

  try {
    const db = getDatabase();
    const allOrders = () =>
      db
        .prepare("SELECT value FROM orders ORDER BY created_at DESC")
        .all()
        .map((row) => JSON.parse(row.value));

    // GET /api/health
    if (pathname === "/health" && method === "GET") {
      return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ status: "ok" }) };
    }

    // POST /api/orders
    if (pathname === "/orders" && method === "POST") {
      let submittedOrder;
      try {
        submittedOrder = JSON.parse(event.body || "{}");
      } catch {
        return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: "Invalid JSON." }) };
      }

      const validationError = validateOrder(submittedOrder);
      if (validationError) {
        return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: validationError }) };
      }

      const order = {
        ...submittedOrder,
        orderId: `KS${Date.now().toString(36).toUpperCase()}${randomBytes(3).toString("hex").toUpperCase()}`,
        createdAt: new Date().toISOString(),
      };

      db.prepare("INSERT INTO orders (order_id, created_at, value) VALUES (?, ?, ?)")
        .run(order.orderId, order.createdAt, JSON.stringify(order));

      return {
        statusCode: 201,
        headers: jsonHeaders,
        body: JSON.stringify({ orderId: order.orderId }),
      };
    }

    // ADMIN ROUTES
    if (pathname.startsWith("/admin")) {
      if (!adminAuthorized(event.headers || {})) {
        return {
          statusCode: 401,
          headers: jsonHeaders,
          body: JSON.stringify({ error: "Incorrect admin password." }),
        };
      }

      if (pathname === "/admin/orders" && method === "GET") {
        return {
          statusCode: 200,
          headers: jsonHeaders,
          body: JSON.stringify({ orders: allOrders() }),
        };
      }

      if (pathname === "/admin/orders" && method === "DELETE") {
        db.prepare("DELETE FROM orders").run();
        return {
          statusCode: 200,
          headers: jsonHeaders,
          body: JSON.stringify({ deleted: true }),
        };
      }

      if (pathname === "/admin/export.csv" && method === "GET") {
        return {
          statusCode: 200,
          headers: {
            "content-type": "text/csv; charset=utf-8",
            "content-disposition": 'attachment; filename="khwab-stitch-orders.csv"',
            "cache-control": "no-store",
          },
          body: orderCsv(allOrders()),
        };
      }

      const deleteMatch = pathname.match(/^\/admin\/orders\/([^/]+)$/);
      if (deleteMatch && method === "DELETE") {
        const orderId = decodeURIComponent(deleteMatch[1]);
        const result = db.prepare("DELETE FROM orders WHERE order_id = ?").run(orderId);
        if (result.changes === 0) {
          return { statusCode: 404, headers: jsonHeaders, body: JSON.stringify({ error: "Order not found." }) };
        }
        return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ deleted: true }) };
      }
    }

    return { statusCode: 404, headers: jsonHeaders, body: JSON.stringify({ error: "API route not found." }) };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers: jsonHeaders,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
}

