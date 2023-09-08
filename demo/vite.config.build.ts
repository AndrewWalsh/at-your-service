/// <reference types="vitest" />
/// <reference types="vite/client" />

import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import nodePolyfills from "rollup-plugin-node-polyfills";
import react from "@vitejs/plugin-react";

import { defineConfig } from "vite";

export default defineConfig({
  base: "/at-your-service",
  define: {
    global: "window",
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
      process: "rollup-plugin-node-polyfills/polyfills/process-es6",
      global: "rollup-plugin-node-polyfills/polyfills/global-es6",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "window",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    rollupOptions: {
      // @ts-ignore
      plugins: [nodePolyfills()],
    },
  },
});