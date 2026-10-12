import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    // `OUT_DIR` lets the server build the next version beside the live one
    // and swap the two in one step (see .github/workflows/deploy.yml), so the
    // site is never served half-built. Locally it is always `dist`.
    outDir: process.env.OUT_DIR ?? "dist",
    // Read by tools/prerender.mjs to name each lab's own chunks in its page,
    // and deleted once it has; nothing serves it.
    manifest: true,
    // Each lab is lazy-loaded; keep vendor chunks stable so adding a lab
    // never invalidates the framework bundle.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
