import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/polis/', // Base path for GitHub Pages
  root: 'web', // Set the root directory to 'web'
  build: {
    outDir: '../web-build', // Output to web-build relative to the root
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './web/src'),
      '@assets': resolve(__dirname, './web/public')
    }
  },
  // Configure asset handling
  assetsInclude: ['**/*.webp', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg'],
}); 