// rollup.config.ts
import esbuild from "rollup-plugin-esbuild";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import scss from "rollup-plugin-scss";
import copy from "rollup-plugin-copy";
import { defineConfig } from "rollup";

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
      scss({
        output: "dist/youtube/style.css",
      }),
      copy({
        targets: [
          { src: "public/**/*", dest: "dist" },
          { src: "manifest.json", dest: "dist" },
        ],
      }),
    ],
  },
]);
