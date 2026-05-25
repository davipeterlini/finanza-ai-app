import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            ui: ["lucide-react"],
          },
        },
      },
      sourcemap: true,
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "Finanza AI",
          short_name: "Finanza AI",
          description: "AI-powered personal finance manager for Brazilian users",
          theme_color: "#10B981",
          background_color: "#0f172a",
          display: "standalone",
          scope: "/",
          start_url: "/",
          icons: [
            { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
            {
              src: "/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        },
      }),
    ],
    define: {
      "import.meta.env.APP_VERSION": JSON.stringify(packageJson.version),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});