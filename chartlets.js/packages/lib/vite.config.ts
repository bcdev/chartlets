import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import { globSync } from "glob";

import manifest from "./package.json";

function findFiles(root: string, pattern: string): string[] {
  return globSync(`${resolve(__dirname, root)}/${pattern}`).map((path) =>
    resolve(__dirname, path),
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
      "@": resolve(__dirname, "src"),
    },
  },
  publicDir: false,
  build: {
    sourcemap: true,
    lib: {
      entry: {
        chartlets: resolve(__dirname, "src/index.ts"),
        "mui-plugin": resolve(__dirname, "src/plugins/mui/index.ts"),
        "vega-plugin": resolve(__dirname, "src/plugins/vega/index.ts"),
        datagrid: resolve(__dirname, "src/plugins/mui/DataGrid.tsx"),
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
