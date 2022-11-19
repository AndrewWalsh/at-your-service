/// <reference types="vitest" />
/// <reference types="vite/client" />

import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import nodePolyfills from "rollup-plugin-node-polyfills";
import react from "@vitejs/plugin-react";

import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
  ],
});
