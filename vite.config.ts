import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5175,
    proxy: {
      // '/api': {
      //   target: '117.72.35.18:7001/api', // 替换为实际后端API地址
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '')
      // },
      // '/dev-api': {
      //   target: 'http://localhost:7001/api', // 替换为开发环境后端地址
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/dev-api/, '')
      // }
      '/api': {
        target: 'http://localhost:7001/api', // 替换为开发环境后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})