import { randomBytes, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const MAX_BODY_BYTES = 10 * 1024 * 1024;
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 60 * 1000;
const outfitTypes = new Set(["Blouse", "Kurti", "Top", "Tunic", "Suit Upper", "Peplum", "Crop Top", "Jacket", "Other"]);

let database;
const requests = new Map();

function getDatabase(databasePath) {
  if (database) return database;
  const filename = resolve(databasePath || process.env.DB_PATH || "data/orders.sqlite");
  mkdirSync(dirname(filename), { recursive: true });
  database = new DatabaseSync(filename);
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

function sendJson(response, status, value) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  response.end(JSON.stringify(value));
}

function rateLimit(request, response, key, max = MAX_ATTEMPTS) {
  const now = Date.now();
  const entry = requests.get(key);
  if (!entry || now - entry.start >= WINDOW_MS) {
    requests.set(key, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  if (entry.count <= max) return false;
  response.setHeader("retry-after", Math.ceil((WINDOW_MS - (now - entry.start)) / 1000));
  sendJson(response, 429, { error: "Too many requests. Please wait a moment and try again." });
  return true;
}

async function readJson(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error("Request is too large.");
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Please send valid JSON.");
    error.status = 400;
    throw error;
  }
}

function validText(value, maxLength) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

function validateOrder(order) {
  if (!order || typeof order !== "object" || Array.isArray(order)) return "Order details are missing.";
  const customer = order.customer || {};
  const cityState = customer.cityState || [customer.city, customer.state].filter(Boolean).join(", ");
  const cleanPhone = (customer.whatsapp || "").replace(/\D/g, "");
  if (!customer.name || !validText(customer.name, 120)) {
    return "Please provide customer name.";
  }
  if (!cleanPhone || cleanPhone.length < 10) {
    return "Please provide a valid 10-digit WhatsApp number.";
  }
  if (!validText(cityState, 160) && !validText(customer.city, 120)) {
    return "Please provide a city.";
  }
  if (!customer.pin || String(customer.pin).trim().length < 4) {
    return "Please provide a valid PIN code.";
  }
  if (!validText(order.outfit?.type, 40) || !outfitTypes.has(order.outfit.type)) {
    return "Please select a valid outfit.";
  }
  if (!validText(order.delivery?.address, 1000)) return "Please enter a delivery address.";
  return null;
}

function adminAuthorized(request, response, adminPassword) {
  if (!adminPassword) {
    sendJson(response, 503, { error: "Admin access is not configured. Set ADMIN_PASSWORD in the server environment." });
    return false;
  }
  const address = request.socket.remoteAddress || "unknown";
  const key = `admin:${address}`;
  const supplied = Buffer.from((request.headers.authorization || "").replace(/^Bearer\s+/i, ""));
  const expected = Buffer.from(adminPassword);
  const valid = supplied.length === expected.length && timingSafeEqual(supplied, expected);
  if (!valid) {
    if (rateLimit(request, response, key, 8)) return false;
    sendJson(response, 401, { error: "Incorrect admin password." });
    return false;
  }
  requests.delete(key);
  return true;
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

function sendCsv(response, orders) {
  response.writeHead(200, {
    "content-type": "text/csv; charset=utf-8",
    "content-disposition": 'attachment; filename="khwab-stitch-orders.csv"',
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  response.end(orderCsv(orders));
}

export function createApiMiddleware({ adminPassword, databasePath } = {}) {
  const getStore = () => getDatabase(databasePath);
  const allOrders = () => getStore().prepare("SELECT value FROM orders ORDER BY created_at DESC").all()
    .map((row) => JSON.parse(row.value));

  return async function apiMiddleware(request, response, next) {
    const url = new URL(request.url || "/", "http://localhost");
    const { pathname } = url;
    if (!pathname.startsWith("/api/")) return next();

    try {
      if (pathname === "/api/health" && request.method === "GET") {
        return sendJson(response, 200, { status: "ok" });
      }

      if (pathname === "/api/orders" && request.method === "POST") {
        const address = request.socket.remoteAddress || "unknown";
        if (rateLimit(request, response, `submit:${address}`)) return;
        const submittedOrder = await readJson(request);
        const validationError = validateOrder(submittedOrder);
        if (validationError) return sendJson(response, 400, { error: validationError });

        const cust = submittedOrder.customer || {};
        const cityState = cust.cityState || [cust.city, cust.state].filter(Boolean).join(", ");
        const order = {
          ...submittedOrder,
          customer: {
            ...cust,
            cityState: cityState || cust.city || "Not specified",
          },
          orderId: `KS${Date.now().toString(36).toUpperCase()}${randomBytes(3).toString("hex").toUpperCase()}`,
          createdAt: new Date().toISOString(),
        };
        getStore().prepare("INSERT INTO orders (order_id, created_at, value) VALUES (?, ?, ?)")
          .run(order.orderId, order.createdAt, JSON.stringify(order));
        return sendJson(response, 201, { orderId: order.orderId });
      }

      const isAdminRoute = pathname.startsWith("/api/admin/");
      if (isAdminRoute && !adminAuthorized(request, response, adminPassword)) return;

      if (pathname === "/api/admin/orders" && request.method === "GET") {
        return sendJson(response, 200, { orders: allOrders() });
      }
      if (pathname === "/api/admin/orders" && request.method === "DELETE") {
        getStore().prepare("DELETE FROM orders").run();
        return sendJson(response, 200, { deleted: true });
      }
      if (pathname === "/api/admin/export.csv" && request.method === "GET") {
        return sendCsv(response, allOrders());
      }

      const deleteMatch = pathname.match(/^\/api\/admin\/orders\/([^/]+)$/);
      if (deleteMatch && request.method === "DELETE") {
        const orderId = decodeURIComponent(deleteMatch[1]);
        const result = getStore().prepare("DELETE FROM orders WHERE order_id = ?").run(orderId);
        if (result.changes === 0) return sendJson(response, 404, { error: "Order not found." });
        return sendJson(response, 200, { deleted: true });
      }

      return sendJson(response, 404, { error: "API route not found." });
    } catch (error) {
      if (response.headersSent) {
        response.destroy(error);
        return;
      }
      if (error.status) return sendJson(response, error.status, { error: error.message });
      console.error("API request failed:", error);
      return sendJson(response, 500, { error: "The request could not be completed. Please try again." });
    }
  };
}
