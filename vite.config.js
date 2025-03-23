import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { promises as fs } from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom plugin to copy PWA files to the build directory
    {
      name: 'copy-pwa-assets',
      closeBundle: async () => {
        try {
          // Copy manifest.json
          const manifestSrc = resolve(__dirname, 'web/public/manifest.json');
          const manifestDest = resolve(__dirname, 'web-build/manifest.json');
          await fs.copyFile(manifestSrc, manifestDest).catch(err => console.error('Failed to copy manifest:', err));
          
          // Copy service worker
          const swSrc = resolve(__dirname, 'web/public/sw.js');
          const swDest = resolve(__dirname, 'web-build/sw.js');
          await fs.copyFile(swSrc, swDest).catch(err => console.error('Failed to copy service worker:', err));
          
          // Create an apple-specific touch icon PNG if needed
          // This step can be extended if you have a proper PNG icon
          
          console.log('PWA assets copied successfully');
        } catch (error) {
          console.error('Error copying PWA assets:', error);
        }
      }
    },
    // Add headers to disable caching for HTML files
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        // Add cache-control headers
        return html.replace(
          '</head>',
          `
  <!-- PWA iOS Splash Screens -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Polis">
  <link rel="apple-touch-startup-image" href="/polis/favicon.svg">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
</head>`
        );
      }
    }
  ],
  base: '/polis/', // Base path for GitHub Pages
  root: 'web', // Set the root directory to 'web'
  build: {
    outDir: '../web-build', // Output to web-build relative to the root
    emptyOutDir: true,
    // Ensure proper chunk size for mobile
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
        // Add a content hash to CSS files to prevent caching issues
        assetFileNames: ({ name }) => {
          if (/\.css$/.test(name ?? '')) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
    // Generate sourcemaps for debugging
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './web/src'),
      '@assets': resolve(__dirname, './web/public')
    }
  },
  // Configure asset handling
  assetsInclude: ['**/*.webp', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg'],
  // Prevent browser caching during development
  server: {
    headers: {
      'Cache-Control': 'no-store',
    },
  },
}); 