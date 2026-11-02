import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  return {
    base: process.env.VITE_BASE_PATH || "/",
    plugins: [
      react(),
      command === "serve" && {
        name: "khwab-stitch-orders-api",
        async configureServer(server) {
          const env = loadEnv(mode, process.cwd(), "");
          const adminPassword = process.env.ADMIN_PASSWORD || env.ADMIN_PASSWORD;
          const databasePath = process.env.DB_PATH || env.DB_PATH;
          try {
            const { createApiMiddleware } = await import("./server/api.js");
            server.middlewares.use(createApiMiddleware({
              adminPassword,
              databasePath,
              allowedOrigins: process.env.ALLOWED_ORIGINS || env.ALLOWED_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173",
            }));
          } catch (error) {
            console.warn("Dev API middleware disabled:", error.message);
          }
        },
      },
    ].filter(Boolean),
  };
});
