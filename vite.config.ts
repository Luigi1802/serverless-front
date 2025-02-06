import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    chunkSizeWarningLimit: 1000, // Limite à 1 Mo au lieu de 500 Ko
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Mettre tout ce qui vient de node_modules dans un chunk séparé
          }
        }
      }
    }
  },
  define: {
    'process.env': process.env
  } 
})
