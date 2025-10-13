import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ADICIONE ESTE BLOCO DE CÓDIGO
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // O endereço do seu backend local
        changeOrigin: true,
      },
    }
  }
})