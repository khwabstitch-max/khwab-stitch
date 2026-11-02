import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:http";
import { closeDatabase, createApiMiddleware } from "./api.js";

const adminPassword = "test-only-password-that-is-long-enough";
const allowedOrigin = "https://khwabstitch.example";
let tempDirectory;
let server;
let baseUrl;

before(async () => {
  tempDirectory = mkdtempSync(join(tmpdir(), "khwab-stitch-api-"));
  const api = createApiMiddleware({
    adminPassword,
    databasePath: join(tempDirectory, "orders.sqlite"),
    allowedOrigins: allowedOrigin,
  });
  server = createServer((request, response) => api(request, response, () => {
    response.writeHead(404);
    response.end();
  }));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  closeDatabase();
  rmSync(tempDirectory, { recursive: true, force: true });
});

function request(path, { method = "GET", body, password = adminPassword, origin = allowedOrigin } = {}) {
  const headers = { origin };
  if (password) headers.authorization = `Bearer ${password}`;
  if (body !== undefined) headers["content-type"] = "application/json";
  return fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

const customerOrder = {
  customer: {
    name: "=Tailored Customer",
    whatsapp: "9876543210",
    email: "",
    city: "Jaipur",
    state: "Rajasthan",
    cityState: "Jaipur, Rajasthan",
    pin: "302001",
    address: "12 Tailor Lane",
  },
  outfit: { type: "Blouse", pieces: "1" },
  design: {},
  measurements: { unit: "inch", provideMethod: "self_measurement", values: { bust: "36" } },
  privacyConsent: true,
  delivery: { address: "12 Tailor Lane" },
};

test("health endpoint allows only configured browser origins", async () => {
  const response = await request("/api/health", { password: "" });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), allowedOrigin);

  const blocked = await request("/api/health", { password: "", origin: "https://unexpected.example" });
  assert.equal(blocked.status, 403);

  const preflight = await fetch(`${baseUrl}/api/admin/orders`, {
    method: "OPTIONS",
    headers: { origin: allowedOrigin, "access-control-request-method": "PATCH" },
  });
  assert.equal(preflight.status, 204);
  assert.match(preflight.headers.get("access-control-allow-methods"), /PATCH/);
});

test("customer orders require valid details and are persisted for authenticated admins", async () => {
  const unauthorized = await request("/api/admin/orders", { password: "wrong-password" });
  assert.equal(unauthorized.status, 401);

  const invalid = await request("/api/orders", {
    method: "POST",
    password: "",
    body: { ...customerOrder, customer: { ...customerOrder.customer, pin: "1234" } },
  });
  assert.equal(invalid.status, 400);

  const missingConsent = await request("/api/orders", {
    method: "POST",
    password: "",
    body: { ...customerOrder, privacyConsent: false },
  });
  assert.equal(missingConsent.status, 400);

  const submitted = await request("/api/orders", {
    method: "POST",
    password: "",
    body: customerOrder,
  });
  assert.equal(submitted.status, 201);
  const { orderId } = await submitted.json();
  assert.match(orderId, /^KS/);

  const list = await request("/api/admin/orders");
  assert.equal(list.status, 200);
  const { orders } = await list.json();
  assert.equal(orders.length, 1);
  assert.equal(orders[0].customer.name, "=Tailored Customer");
  assert.equal(orders[0].measurements.values.bust, "36");
  assert.equal(orders[0].privacyConsent, true);
  assert.ok(orders[0].privacyConsentAt);

  const updated = await request(`/api/admin/orders/${orderId}`, {
    method: "PATCH",
    body: { status: "Stitching" },
  });
  assert.equal(updated.status, 200);
  assert.equal((await updated.json()).order.status, "Stitching");

  const invalidStatus = await request(`/api/admin/orders/${orderId}`, {
    method: "PATCH",
    body: { status: "Paid" },
  });
  assert.equal(invalidStatus.status, 400);

  const csv = await request("/api/admin/export.csv");
  assert.equal(csv.status, 200);
  assert.match(await csv.text(), /"'=Tailored Customer"/);

  const deleted = await request(`/api/admin/orders/${orderId}`, { method: "DELETE" });
  assert.equal(deleted.status, 200);
  assert.deepEqual((await (await request("/api/admin/orders")).json()).orders, []);
});

test("admins can save walk-in orders without requiring an online delivery address", async () => {
  const order = {
    orderId: "WALKIN-001",
    customer: { name: "Walk-in Customer", whatsapp: "+91 9876543210" },
    outfit: { type: "Kurti" },
    measurements: { values: {} },
  };
  const response = await request("/api/admin/orders", {
    method: "POST",
    body: order,
  });
  assert.equal(response.status, 201);
  const saved = await response.json();
  assert.equal(saved.orderId, "WALKIN-001");

  const duplicate = await request("/api/admin/orders", { method: "POST", body: order });
  assert.equal(duplicate.status, 409);
});
