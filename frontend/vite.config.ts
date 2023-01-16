/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_PROXY_HOST: PROXY_HOST = 'localhost:8080' } = loadEnv(
    mode,
    process.cwd(),
    '',
  );

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: `http://${PROXY_HOST}`,
          changeOrigin: false,
        },
      },
    },
  };
});
