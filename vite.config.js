import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'jspdf': ['jspdf'],
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'framer-motion',
            'react-icons'
          ]
        }
      }
    }
  },
  optimizeDeps: {
    include: ['jspdf']
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true
  },
  preview: {
    port: 5173,
    strictPort: true,
    host: true
  }
});
