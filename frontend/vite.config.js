import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendHost = env.VITE_BACKEND_HOST || 'http://127.0.0.1'
  const backendPath = env.VITE_BACKEND_PROXY_PATH || '/git/dssmousegaming/backend/api'

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendHost,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, backendPath),
        },
      },
    },
  }
})
