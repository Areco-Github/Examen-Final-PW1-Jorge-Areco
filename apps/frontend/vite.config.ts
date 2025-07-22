import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false, // Deshabilita source maps en producción para evitar warnings
  },
  server: {
    // Esto puede ayudar a ignorar ciertos source maps problemáticos en dev
    sourcemapIgnoreList: (sourcePath: string) => {
      return (
        /installHook\.js$/.test(sourcePath) ||
        /react_devtools_backend_compact\.js$/.test(sourcePath)
      );
    },
  },
});
