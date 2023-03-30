import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
    vue()
  ],
  define: {
    global: {},
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
  }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "sass:math";
          @import "./src/assets/styles/_variables.scss";
        `
      }
    }
  }
})
