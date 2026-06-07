// frontend-react/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // ─── Dev server config ──────────────────────────────────────────────────
  server: {
    port: 5173,

    // Proxy API calls to Express backend — avoids CORS in development.
    // Any request starting with /api or /uploads is forwarded to port 3000.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  // ─── Build config ───────────────────────────────────────────────────────
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split vendor code into separate chunks for better caching
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
        }
      }
    }
  }
})
