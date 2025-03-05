import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    proxy: {
      '/umbraco/api': {
        // Adjust target as needed; here we're assuming your ASP.NET Core backend is
        // running on HTTP on port 10768. If it's HTTPS, update the target accordingly.
        target: 'http://localhost:10768',
        changeOrigin: true,
        secure: false,
      },
      '/umbraco/delivery': {
        target: 'http://localhost:10768',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
