// vite.config.ts
import { NodeGlobalsPolyfillPlugin } from "file:///Users/chroot/Documents/github/at-your-service/node_modules/@esbuild-plugins/node-globals-polyfill/dist/index.js";
import { NodeModulesPolyfillPlugin } from "file:///Users/chroot/Documents/github/at-your-service/node_modules/@esbuild-plugins/node-modules-polyfill/dist/index.js";
import nodePolyfills from "file:///Users/chroot/Documents/github/at-your-service/node_modules/rollup-plugin-node-polyfills/dist/index.js";
import typescript from "file:///Users/chroot/Documents/github/at-your-service/node_modules/@rollup/plugin-typescript/dist/es/index.js";
import react from "file:///Users/chroot/Documents/github/at-your-service/demo/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///Users/chroot/Documents/github/at-your-service/demo/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    typescript({ tsconfig: "./tsconfig.json" })
  ],
  resolve: {
    alias: {
      buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
      process: "rollup-plugin-node-polyfills/polyfills/process-es6"
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis"
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()]
    }
  },
  server: {
    fs: {
      allow: [".."]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY2hyb290L0RvY3VtZW50cy9naXRodWIvYXQteW91ci1zZXJ2aWNlL2RlbW9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9jaHJvb3QvRG9jdW1lbnRzL2dpdGh1Yi9hdC15b3VyLXNlcnZpY2UvZGVtby92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvY2hyb290L0RvY3VtZW50cy9naXRodWIvYXQteW91ci1zZXJ2aWNlL2RlbW8vdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGUvY2xpZW50XCIgLz5cblxuaW1wb3J0IHsgTm9kZUdsb2JhbHNQb2x5ZmlsbFBsdWdpbiB9IGZyb20gXCJAZXNidWlsZC1wbHVnaW5zL25vZGUtZ2xvYmFscy1wb2x5ZmlsbFwiO1xuaW1wb3J0IHsgTm9kZU1vZHVsZXNQb2x5ZmlsbFBsdWdpbiB9IGZyb20gXCJAZXNidWlsZC1wbHVnaW5zL25vZGUtbW9kdWxlcy1wb2x5ZmlsbFwiO1xuaW1wb3J0IG5vZGVQb2x5ZmlsbHMgZnJvbSBcInJvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHNcIjtcbmltcG9ydCB0eXBlc2NyaXB0IGZyb20gXCJAcm9sbHVwL3BsdWdpbi10eXBlc2NyaXB0XCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHR5cGVzY3JpcHQoeyB0c2NvbmZpZzogXCIuL3RzY29uZmlnLmpzb25cIiB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBidWZmZXI6IFwicm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvYnVmZmVyLWVzNlwiLFxuICAgICAgcHJvY2VzczogXCJyb2xsdXAtcGx1Z2luLW5vZGUtcG9seWZpbGxzL3BvbHlmaWxscy9wcm9jZXNzLWVzNlwiLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICBkZWZpbmU6IHtcbiAgICAgICAgZ2xvYmFsOiBcImdsb2JhbFRoaXNcIixcbiAgICAgIH0sXG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIE5vZGVHbG9iYWxzUG9seWZpbGxQbHVnaW4oe1xuICAgICAgICAgIHByb2Nlc3M6IHRydWUsXG4gICAgICAgICAgYnVmZmVyOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgICAgTm9kZU1vZHVsZXNQb2x5ZmlsbFBsdWdpbigpLFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHBsdWdpbnM6IFtub2RlUG9seWZpbGxzKCldLFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGZzOiB7XG4gICAgICBhbGxvdzogWycuLiddLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFHQSxTQUFTLGlDQUFpQztBQUMxQyxTQUFTLGlDQUFpQztBQUMxQyxPQUFPLG1CQUFtQjtBQUMxQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFdBQVc7QUFFbEIsU0FBUyxvQkFBb0I7QUFFN0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sV0FBVyxFQUFFLFVBQVUsa0JBQWtCLENBQUM7QUFBQSxFQUM1QztBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsU0FBUztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxNQUNkLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCwwQkFBMEI7QUFBQSxVQUN4QixTQUFTO0FBQUEsVUFDVCxRQUFRO0FBQUEsUUFDVixDQUFDO0FBQUEsUUFDRCwwQkFBMEI7QUFBQSxNQUM1QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFFYixTQUFTLENBQUMsY0FBYyxDQUFDO0FBQUEsSUFDM0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixPQUFPLENBQUMsSUFBSTtBQUFBLElBQ2Q7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
