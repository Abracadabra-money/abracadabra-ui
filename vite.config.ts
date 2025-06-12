import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import devNodePolyfills from "vite-plugin-node-polyfills";
import nodePolyfills from "rollup-plugin-polyfill-node";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devNodePolyfills.nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
    vue(),
  ],
  // TODO: enable before opening PR
  // esbuild: {
  //   drop: ["console", "debugger"], // warn: to comment in dev mode to show logs in .ts files
  // },
  build: {
    target: "esnext",
    rollupOptions: {
      plugins: [
        // ↓ Needed for build
        nodePolyfills(),
      ],
    },
    // ↓ Needed for build if using WalletConnect and other providers
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "sass:math";
          @import "./src/assets/styles/_variables.scss";
          @import "./src/assets/styles/_mixins.scss";
        `,
      },
    },
  },
});
