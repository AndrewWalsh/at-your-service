/// <reference types="vitest" />
/// <reference types="vite/client" />

import typescript from "@rollup/plugin-typescript";
import react from "@vitejs/plugin-react";

import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), typescript({ tsconfig: "./tsconfig.json" })],
  resolve: {
    alias: {
      buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
      process: "rollup-plugin-node-polyfills/polyfills/process-es6",
    },
  },
  test: {
    coverage: {
      reporter: ["lcov"],
      all: true,
      exclude: ["**/index.ts", "**/test-utils/**"],
      include: ["src"],
    },
  },
});
