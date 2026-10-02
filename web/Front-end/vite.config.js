import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Quita el header Origin: para el navegador es la misma página (no hay CORS),
// así el gateway no rechaza el dominio del túnel
function stripOrigin(proxy) {
  proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'))
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['react-native']
  },
  server: {
    // El navegador llama a /api y /mock en el mismo origen; Vite lo reenvía desde este PC.
    // Así funciona también desde el túnel de VS Code (localhost sería el PC del otro).
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: stripOrigin,
      },
      '/mock': {
        target: 'http://localhost:3100',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mock/, ''),
        configure: stripOrigin,
      },
    },
  },
})