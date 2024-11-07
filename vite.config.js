import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    // Don't fail on missing env vars
    minify: true,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MISSING_ENVIRONMENT_VARIABLE') {
          return;
        }
        warn(warning);
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true
  }
});
