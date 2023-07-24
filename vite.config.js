import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: { "@client": path.resolve(__dirname, "./src/client") }
    },
    build: {
        // sourcemaps have to be inline due to https://github.com/electron/electron/issues/22996
        sourcemap: "inline"
    }
});
