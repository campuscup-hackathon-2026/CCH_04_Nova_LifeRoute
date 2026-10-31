import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand'],
          charts: ['recharts'],
          maps: ['leaflet'],
          forms: ['react-hook-form', 'zod', '@hookform/resolvers'],
          icons: ['lucide-react'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
