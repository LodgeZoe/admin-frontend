import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'http:/124.220.107.230:8080',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http:/124.220.107.230:8080',
        changeOrigin: true,
      },
    },
  },
})
