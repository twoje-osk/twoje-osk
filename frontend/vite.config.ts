/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const PROXY_HOST = process.env.PROXY_HOST ?? 'localhost:8080';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://${PROXY_HOST}`,
        changeOrigin: false,
      },
    },
  },
});
