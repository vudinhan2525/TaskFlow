import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vitePluginImp from "vite-plugin-imp";
import viteCompression from "vite-plugin-compression";
export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: "brotliCompress", // hoặc 'gzip'
    }),
    tailwindcss(),
    vitePluginImp({
      libList: [
        {
          libName: "antd",
          style: (name) => `antd/es/${name}/style/index.js`, // import CSS theo component
        },
      ],
    }),
  ],
  resolve: {
    alias: [{ find: "@libs", replacement: "/src" }],
  },
});
