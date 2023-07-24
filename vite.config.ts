import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // sourcemaps have to be inline due to https://github.com/electron/electron/issues/22996
    sourcemap: "inline",
  },
  plugins: [react()],
});
