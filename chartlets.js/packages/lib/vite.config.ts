/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import { globSync } from "glob";

import manifest from "./package.json";

const rootDir = import.meta.dirname;

function findFiles(root: string, pattern: string): string[] {
  return globSync(`${resolve(rootDir, root)}/${pattern}`).map((path) =>
    resolve(rootDir, path),
  );
}

const externalModules = [
  ...Object.keys(manifest.peerDependencies || {}),
  ...Object.keys(manifest.dependencies || {}),
];

const externalFiles = [...findFiles("src", "**/*.test.*")];

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src/**/*.ts", "src/**/*.tsx"],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(rootDir, "src"),
    },
  },
  publicDir: false,
  build: {
    sourcemap: true,
    lib: {
      entry: {
        chartlets: resolve(rootDir, "src/index.ts"),
        "mui-plugin": resolve(rootDir, "src/plugins/mui/index.ts"),
        "vega-plugin": resolve(rootDir, "src/plugins/vega/index.ts"),
      },
      //formats: ["es"],
    },
    rollupOptions: {
      // externalize deps that shouldn't be bundled into the library
      external: [/^@mui/, /^react/, ...externalModules, ...externalFiles],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          microdiff: "diff",
          react: "React",
          "react-dom": "ReactDOM",
          "react-vega": "ReactVega",
          zustand: "zustand",
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "vitest.setup.ts",
    coverage: {
      provider: "istanbul",
    },
    onConsoleLog: (_log: string, _type: "stdout" | "stderr"): false | void => {
      const logLevel = process.env.VITE_LOG_LEVEL;
      if (!logLevel || logLevel === "OFF") {
        return false;
      }
    },
  },
});
