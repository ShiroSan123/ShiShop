import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'info', // Suppress warnings, only show errors
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
  ]
});
