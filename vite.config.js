import { defineConfig } from 'vite'

export default defineConfig({
  base: '/prompt-artisan/',
  
  // --- НАЧАЛО НОВОЙ СЕКЦИИ ---
  // Эта секция явно говорит Vite, как называть файлы в папке dist
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    }
  }
  // --- КОНЕЦ НОВОЙ СЕКЦИИ ---
})