// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    port: 1234,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './js'),
    },
  },
});
