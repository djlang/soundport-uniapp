import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './components'),
      '@pages': path.resolve(__dirname, './pages'),
      '@services': path.resolve(__dirname, './services'),
      '@store': path.resolve(__dirname, './store'),
      '@types': path.resolve(__dirname, './types'),
      '@utils': path.resolve(__dirname, './utils')
    }
  }
})
