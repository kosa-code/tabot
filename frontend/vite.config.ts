import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@data': fileURLToPath(new URL('../backend/data', import.meta.url)),
    },
  },
  server: {
    // backend/data のサンプルJSONを読むため、リポジトリルートまで許可する
    fs: { allow: [repoRoot] },
  },
})
