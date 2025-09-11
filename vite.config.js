// vite.config.js

import { defineConfig } from 'vite'

export default defineConfig({
  // Эта строка говорит Vite, что на GitHub Pages проект будет лежать
  // в папке /prompt-artisan/, и все пути нужно строить относительно неё.
  base: '/prompt-artisan/',
})