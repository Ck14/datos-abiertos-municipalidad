import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/minfin': {
        target: 'https://datos.minfin.gob.gt',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/minfin/, '/api/action'),
        secure: true,
      }
    }
  }
})
