/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";

import { defineConfig } from "vite";


// To install
// Ensure ./src/init-msw.ts imports from "at-your-service";
// Run commands from the project root dir:
// npm run build && npm link at-your-service && cd demo && npm run build:docs
export default defineConfig({
  plugins: [
    react(),
  ],
});
