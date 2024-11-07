import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    // Don't fail on missing env vars
    minify: true
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true
  },
  // Ensure we only expose VITE_ prefixed env vars
  envPrefix: ['VITE_']
});
