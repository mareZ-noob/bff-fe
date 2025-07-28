import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  define: {
    global: "window",
  },

  resolve: {
    alias: {
      "@/assets": path.resolve(__dirname, "./src/assets"),
      "@/common": path.resolve(__dirname, "./src/common"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/configs": path.resolve(__dirname, "./src/configs"),
      "@/contexts": path.resolve(__dirname, "./src/contexts"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/interfaces": path.resolve(__dirname, "./src/interfaces"),
      "@/layouts": path.resolve(__dirname, "./src/views/layouts"),
      "@/locales": path.resolve(__dirname, "./src/locales"),
      "@/modules": path.resolve(__dirname, "./src/modules"),
      "@/pages": path.resolve(__dirname, "./src/views/pages"),
      "@/routes": path.resolve(__dirname, "./src/routes"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/styles": path.resolve(__dirname, "./src/styles"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/views": path.resolve(__dirname, "./src/views"),
    },
  },
});
