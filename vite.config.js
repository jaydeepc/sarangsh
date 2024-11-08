import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    minify: true,
    rollupOptions: {
      external: ['jspdf'],
      output: {
        globals: {
          jspdf: 'jsPDF'
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
  }
});
