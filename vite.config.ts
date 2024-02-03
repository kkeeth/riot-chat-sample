import { defineConfig } from "vite";
import { compile } from "@riotjs/compiler";
import ts from "typescript";
import fs from "fs";
import path from "path";
import typescript from "@rollup/plugin-typescript";

const riotPlugin = () => {
  return {
    name: "riot",
    transform(src: string, id: string) {
      if (id.endsWith(".riot")) {
        const { code: riotCompiledCode } = compile(src, { file: id });

        const tempFilePath = path.resolve("./temp", path.basename(id) + ".ts");
        if (!fs.existsSync(path.dirname(tempFilePath))) {
          fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
        }
        fs.writeFileSync(tempFilePath, riotCompiledCode);

        const tsResult = ts.transpileModule(riotCompiledCode, {
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ESNext,
          },
        });

        fs.unlinkSync(tempFilePath);

        return {
          code: tsResult.outputText,
          map: tsResult.sourceMapText
            ? JSON.parse(tsResult.sourceMapText)
            : null,
        };
      }
    },
  };
};

export default defineConfig({
  plugins: [riotPlugin(), typescript()],
  build: {
    outDir:
      "dist" /** https://vitejs.dev/config/build-options.html#build-outdir */,
    minify:
      "esbuild" /** https://vitejs.dev/config/build-options.html#build-minify */,
    target:
      "esnext" /** https://vitejs.dev/config/build-options.html#build-target */,
  },
});
