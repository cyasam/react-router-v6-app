import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'exclude-mock-service-worker',
      closeBundle() {
        // Remove mockServiceWorker.js from dist after build
        const filePath = path.resolve(__dirname, 'dist/mockServiceWorker.js');
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      },
    },
  ],
  publicDir: 'public',
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    copyPublicDir: true,
  },
});
