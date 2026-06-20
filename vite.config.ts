import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const storeApiUrl = env.VITE_STORE_API_URL ? new URL(env.VITE_STORE_API_URL) : undefined

  return {
    plugins: [react(), tailwindcss()],
    server: storeApiUrl
      ? {
          proxy: {
            '/wc-api': {
              target: storeApiUrl.origin,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/wc-api/, ''),
            },
          },
        }
      : undefined,
  }
})
