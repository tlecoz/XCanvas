
// vite.config.js
import { defineConfig } from 'vite'
import Dts from 'vite-plugin-dts';
export default defineConfig({
    plugins: [Dts()],
    build: {
        minify: false,
        lib: {
            entry: 'src/index.ts',
            name: 'xcanvas',
            fileName: 'xcanvas',
        },
    }
})
