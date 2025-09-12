import { defineConfig } from 'vite'

// Эта функция будет автоматически определять, какая команда запущена
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    // Если это локальная разработка (npm run dev)
    return {
      // Никакого `base` не нужно
    }
  } else {
    // Если это сборка для публикации (npm run build)
    return {
      base: '/prompt-artisan/',
    }
  }
})