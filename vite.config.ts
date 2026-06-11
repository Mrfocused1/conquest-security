import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The CMS is served under /admin. The marketing homepage (in /site) is copied
// to the deploy root by scripts/postbuild.mjs so that "/" serves the homepage
// and "/admin" serves this app.
export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  build: {
    outDir: 'dist/admin',
    emptyOutDir: true,
  },
  server: { port: 5180, host: true },
  preview: { port: 5180, host: true },
})
