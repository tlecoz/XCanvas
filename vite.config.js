
// vite.config.js


/*

//TO PUBLISH THE LIBRARY ITSELF : 

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

*/

//TO PUBLISH A DEMO ON NETLIFY : 

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: 'dist', // Répertoire de sortie des fichiers construits
        emptyOutDir: true, // Nettoyer le répertoire de sortie avant de construire
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'), // Chemin vers votre fichier index.html
            },
        },
    },
});