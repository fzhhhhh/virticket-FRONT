import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // ✅ Configuración del puerto
  },
  build: {
    minify: "terser", // ✅ Optimización en producción
  },
  resolve: {
    alias: {
      "@components": "/src/components",
      "@pages": "/src/pages",
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify("1.0.0"), // ✅ Variable global
  },
});