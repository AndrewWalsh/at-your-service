/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";

import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      external: ["at-your-service"],
    },
  },
});
