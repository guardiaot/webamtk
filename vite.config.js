import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';



const fullReloadAlways = {
    name: 'full-reload-always',
    handleHotUpdate({ server }) {
        server.ws.send({
            type: 'custom',
            event: 'special-update',
            data: {}
        })
        return []
    },
}


export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        //  fullReloadAlways
    ],
    build: {
        manifest: true,
        outDir: 'public/build',
        rollupOptions: {
            input: "resources/js/app.jsx", // Ponto de entrada do seu app
        },
    },
    watch: {
        usePolling: true,
        origin: 'http://localhost',

    },
    server: {

        hmr: {
            host: 'localhost',
            protocol: 'ws',
        }
    }
});