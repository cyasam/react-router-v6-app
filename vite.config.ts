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
        manualChunks: (id) => {
          // Vendor chunks - node_modules
          if (id.includes('node_modules')) {
            // React Router (split from other vendors)
            if (
              id.includes('react-router-dom') ||
              id.includes('@remix-run/router')
            ) {
              return 'vendor-router';
            }
            // React core
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react';
            }
            // Scheduler (React dependency)
            if (id.includes('scheduler')) {
              return 'vendor-react';
            }
            // UI/utility libraries
            if (id.includes('match-sorter') || id.includes('sort-by')) {
              return 'vendor-utils';
            }
            // Everything else
            return 'vendor';
          }

          // Feature chunks
          if (id.includes('features/contacts')) {
            return 'feature-contacts';
          }
          if (id.includes('features/main')) {
            return 'feature-main';
          }

          // Root layout
          if (id.includes('src/root.tsx')) {
            return 'layout-root';
          }
        },
      },
    },
    copyPublicDir: true,
  },
});
