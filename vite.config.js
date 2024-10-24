import { defineConfig } from "vite";

export default defineConfig({
  // Base config options
  base: "/",

  // Build options
  build: {
    target: "esnext",
    outDir: "dist",
  },

  // Server options
  server: {
    port: 5173,
    strictPort: false,
    open: true,
  },

  // Dependency optimization options
  optimizeDeps: {
    include: ["qrcode"],
  },
});
