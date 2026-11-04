import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        comoUsar: resolve(import.meta.dirname, 'como-usar.html'),
        downloads: resolve(import.meta.dirname, 'downloads.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  preview: {
    port: 4173,
  },
});
