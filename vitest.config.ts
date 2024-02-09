import { fileURLToPath, resolve } from "node:url";
import { mergeConfig, UserConfig } from "vite";
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
  // @ts-ignore
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/*"],
      root: fileURLToPath(new URL("./", import.meta.url)),
      setupFiles: [
        resolve(
          fileURLToPath(new URL("./src/", import.meta.url)),
          "test/setup.ts"
        ),
        "./vitest.setup.ts",
      ],
      deps: {
        inline: ["vitest-canvas-mock"],
      },
    },
  })
);
