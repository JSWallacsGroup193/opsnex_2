
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: { 
    port: 5000, 
    host: '0.0.0.0',
    hmr: false,
    allowedHosts: true,
    proxy: { '/api': 'http://localhost:3000' } 
  },
  define: { 'process.env': {} }
})
