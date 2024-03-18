import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import type { PluginOption } from 'vite';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ====https://github.com/bvaughn/react-virtualized/issues/1722==== //
function reactVirtualized(): PluginOption {
  const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;

  return {
    name: 'my:react-virtualized',
    async configResolved() {
      const reactVirtualizedPath = path.dirname(
        fileURLToPath(import.meta.resolve('react-virtualized'))
      );

      const brokenFilePath = path.join(
        reactVirtualizedPath,
        '..', // back to dist
        'es',
        'WindowScroller',
        'utils',
        'onScroll.js'
      );
      const brokenCode = await readFile(brokenFilePath, 'utf-8');

      const fixedCode = brokenCode.replace(WRONG_CODE, '');
      await writeFile(brokenFilePath, fixedCode);
    },
  };
}
// ======== //

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactVirtualized()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@ui": path.resolve(__dirname, './src/components/ui')
    },
  },
})
