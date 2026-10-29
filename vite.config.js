import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createApiMiddleware } from "./server/api.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const adminPassword = process.env.ADMIN_PASSWORD || env.ADMIN_PASSWORD;
  const databasePath = process.env.DB_PATH || env.DB_PATH;

  return {
    plugins: [
      react(),
      {
        name: "khwab-stitch-orders-api",
        configureServer(server) {
          server.middlewares.use(createApiMiddleware({ adminPassword, databasePath }));
        },
      },
    ],
  };
});
