import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import { configDefaults, defineConfig } from "vitest/config";
import viteConfig from "./vite.config";
import vue from "@vitejs/plugin-vue";
import devNodePolyfills from "vite-plugin-node-polyfills";

export default mergeConfig(
  {
    ...viteConfig,
    plugins: [
      devNodePolyfills.nodePolyfills({
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => ["router-link"].includes(tag),
          },
        },
      }),
    ],
  },
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/*"],
      root: fileURLToPath(new URL("./", import.meta.url)),
    },
  })
);
