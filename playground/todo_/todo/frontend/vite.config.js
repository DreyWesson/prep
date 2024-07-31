import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    port: 8000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
  },
})
