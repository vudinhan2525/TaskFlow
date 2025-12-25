import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vitePluginImp from "vite-plugin-imp";
import viteCompression from "vite-plugin-compression";
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      // Proxy WebSocket requests
      "/ws": {
        target: "ws://localhost:5003",
        ws: true,
        changeOrigin: true,
      },
    },
  },
  plugins: [
    viteCompression({
      algorithm: "brotliCompress",
    }),
    tailwindcss(),
    vitePluginImp({
      libList: [
        {
          libName: "antd",
          style: (name) => `antd/es/${name}/style/index.js`,
        },
      ],
    }),
  ],
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: [{ find: "@libs", replacement: "/src" }],
  },
});
