// rollup.config.ts
import esbuild from "rollup-plugin-esbuild";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import scss from "rollup-plugin-scss";
import copy from "rollup-plugin-copy";
import { defineConfig } from "rollup";
import fs from "fs";

const basePlugins = [
  resolve({ browser: true }),
  commonjs({
    transformMixedEsModules: true,
  }),
  esbuild({
    target: "es2022",
    minify: true,
    tsconfig: "./tsconfig.json",
  }),
];

const cleanupPlugin = () => ({
  name: "cleanup",
  writeBundle: () => {
    const dummyPath = "dist/youtube/dummy.js";
    if (fs.existsSync(dummyPath)) {
      fs.unlinkSync(dummyPath);
    }
  },
});

export default defineConfig([
  {
    input: "src/background/index.ts",
    output: {
      file: "dist/background/index.js",
      format: "iife",
    },
    plugins: basePlugins,
  },
  {
    input: "src/content-scripts/youtube/bridge/injected-bridge.ts",
    output: {
      file: "dist/youtube/injected-bridge.js",
      format: "iife",
    },
    plugins: basePlugins,
  },
  {
    input: "src/content-scripts/youtube/style.scss",
    output: {
      file: "dist/youtube/dummy.js",
    },
    onwarn(warning, warn) {
      if (warning.code === "EMPTY_BUNDLE") return;
      warn(warning);
    },
    plugins: [
      scss({
        fileName: "style.css",
        outputStyle: "compressed",
      }),
      cleanupPlugin(),
    ],
  },
  {
    input: "src/content-scripts/youtube/main.ts",
    output: {
      file: "dist/youtube/index.js",
      format: "iife",
    },
    onwarn(warning, warn) {
      if (warning.code === "THIS_IS_UNDEFINED") return;
      warn(warning);
    },
    plugins: [
      ...basePlugins,
      copy({
        targets: [
          { src: "src/public/", dest: "dist" },
          { src: "src/manifest.json", dest: "dist" },
        ],
      }),
    ],
  },
]);
