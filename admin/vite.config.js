import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react-router-dom'],
    }
  },
  resolve: {
    alias: {
      'react-router-dom': 'node_modules/react-router-dom/index.js'
    }
  }
});
