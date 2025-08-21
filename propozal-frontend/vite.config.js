import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        bypass: (req, res, options) => {
          // 정적 파일들은 프록시하지 않고 Vite가 처리하도록 함
          if (req.headers.accept?.includes('text/html') ||
              req.url.includes('.js') ||
              req.url.includes('.css') ||
              req.url.includes('.png') ||
              req.url.includes('.jpg') ||
              req.url.includes('.ico') ||
              req.url.includes('@vite') ||
              req.url.includes('node_modules')) {
            return req.url;
          }
        },
      },
    },
  },
});
