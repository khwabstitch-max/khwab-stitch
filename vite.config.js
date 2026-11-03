import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const adminPassword = process.env.ADMIN_PASSWORD || env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || env.VITE_ADMIN_PASSWORD || "Dhaniya123";
  const whatsapp = process.env.VITE_WHATSAPP || env.VITE_WHATSAPP || process.env.WHATSAPP || env.WHATSAPP || "+91 93681 36683";
  const website = process.env.VITE_WEBSITE || env.VITE_WEBSITE || process.env.WEBSITE || env.WEBSITE || "https://khwabstitch-max.github.io/khwab-stitch/";
  const instagram = process.env.VITE_INSTAGRAM || env.VITE_INSTAGRAM || process.env.INSTAGRAM || env.INSTAGRAM || "@khwabstitch";

  return {
    base: process.env.VITE_BASE_PATH || "/",
    define: {
      "import.meta.env.VITE_ADMIN_PASSWORD": JSON.stringify(adminPassword),
      "import.meta.env.VITE_WHATSAPP": JSON.stringify(whatsapp),
      "import.meta.env.VITE_WEBSITE": JSON.stringify(website),
      "import.meta.env.VITE_INSTAGRAM": JSON.stringify(instagram),
    },
    plugins: [
      react(),
      command === "serve" && {
        name: "khwab-stitch-orders-api",
        async configureServer(server) {
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
