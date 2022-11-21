/// <reference types="vitest" />
/// <reference types="vite/client" />

import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import nodePolyfills from "rollup-plugin-node-polyfills";
import typescript from "@rollup/plugin-typescript";
import react from "@vitejs/plugin-react";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [peerDepsExternal(), react(), typescript({ tsconfig: "./tsconfig.json" })],
  resolve: {
    alias: {
      buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
      process: "rollup-plugin-node-polyfills/polyfills/process-es6",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
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
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "at-your-service",
      fileName: (format) => `index.${format}.js`,
    },
  },
  test: {
    coverage: {
      exclude: ["src/test-utils", "**/*.test.ts"],
      reporter: ["lcov"],
    },
  },
});
