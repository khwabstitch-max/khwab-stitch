import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { createApiMiddleware } from "./server/api.js";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const env = loadEnv("production", projectRoot, "");
const adminPassword = process.env.ADMIN_PASSWORD || env.ADMIN_PASSWORD;
const distRoot = resolve(projectRoot, "dist");
const port = Number(process.env.PORT || 3000);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

if (!existsSync(resolve(distRoot, "index.html"))) {
  console.error("Production files are missing. Run `npm run build` first.");
  process.exit(1);
}
if (!adminPassword) {
  console.warn("ADMIN_PASSWORD is not configured; order submissions work, but the admin panel is locked.");
}

const api = createApiMiddleware({
  adminPassword,
  databasePath: process.env.DB_PATH || env.DB_PATH,
});

function serveStatic(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { allow: "GET, HEAD" });
    response.end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }
  const requestedPath = pathname === "/" ? "index.html" : pathname.slice(1);
  let filename = resolve(distRoot, requestedPath);
  if (!filename.startsWith(`${distRoot}${sep}`) && filename !== resolve(distRoot, "index.html")) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  if (!existsSync(filename) || !statSync(filename).isFile()) filename = resolve(distRoot, "index.html");

  response.writeHead(200, {
    "content-type": mimeTypes[extname(filename)] || "application/octet-stream",
    "cache-control": filename.endsWith("index.html") ? "no-cache" : "public, max-age=31536000, immutable",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
  });
  if (request.method === "HEAD") response.end();
  else createReadStream(filename).pipe(response);
}

const server = createServer((request, response) => api(request, response, () => serveStatic(request, response)));
server.listen(port, "0.0.0.0", () => {
  console.log(`Khwab Stitch is listening on http://localhost:${port}`);
});
