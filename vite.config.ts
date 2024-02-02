import { defineConfig } from 'vite';
import {compile} from '@riotjs/compiler'
import typescript from '@rollup/plugin-typescript';

// Riot.js用のカスタムプラグイン
const riotPlugin = () => {
  return {
    name: 'riot',
    transform(code, id) {
      if (id.endsWith('.riot')) {
        const { code: compiledCode } = compile(code, { file: id });
        return {
          code: compiledCode,
          map: null // ソースマップはこの例では省略
        };
      }
    }
  };
};

export default defineConfig({
  plugins: [
    riotPlugin(),
    typescript()
  ]
});

