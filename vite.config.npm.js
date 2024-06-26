import { defineConfig } from 'vite';
import Dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [Dts()],
    build: {
        minify: false,
        lib: {
            entry: 'src/index.ts',
            name: 'xcanvas-ts',
            fileName: format => `xcanvas-ts.${format}.js`,
            formats: ['es', 'umd'],
        }
    }
});
