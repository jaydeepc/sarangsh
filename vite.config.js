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
          pdfjsLib: ['pdfjs-dist/legacy/build/pdf']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['pdfjs-dist/legacy/build/pdf']
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true
  }
});
