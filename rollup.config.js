import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default [
  {
    input: "src/index.js",

    output: [
      {
        file: "dist/index.mjs",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/index.cjs",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
      {
        file: "dist/index.min.js",
        format: "umd",
        name: "SoftKeyboardController",
        sourcemap: true,
        plugins: [terser()],
      },
    ],

    plugins: [
      nodeResolve(),
    ],
  },
];