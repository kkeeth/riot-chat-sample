import { defineConfig } from "vite";
import { compile } from "@riotjs/compiler";
import ts from "typescript";
import typescript from "@rollup/plugin-typescript";
import fs from "fs";
import path from "path";

// Riot.js用のカスタムプラグイン
const riotPlugin = () => {
  return {
    name: "riot",
    transform(src: string, id: string) {
      if (id.endsWith(".riot")) {
        // .riotファイルをJavaScriptにコンパイル
        const { code: riotCompiledCode } = compile(src, { file: id });

        // コンパイルされたコードを一時ファイルに書き込む
        const tempFilePath = path.resolve("./temp", path.basename(id) + ".ts");
        if (!fs.existsSync(path.dirname(tempFilePath))) {
          fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
        }
        fs.writeFileSync(tempFilePath, riotCompiledCode);

        // TypeScriptトランスパイラを使用してコードをトランスパイル
        const tsResult = ts.transpileModule(riotCompiledCode, {
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ESNext,
          },
        });

        // 一時ファイルを削除
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
  plugins: [
    riotPlugin(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
  ],
  build: {
    outDir:
      "dist" /** https://vitejs.dev/config/build-options.html#build-outdir */,
    minify:
      "esbuild" /** https://vitejs.dev/config/build-options.html#build-minify */,
    target:
      "esnext" /** https://vitejs.dev/config/build-options.html#build-target */,
  },
});
