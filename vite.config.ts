import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  // No GitHub Pages o workflow define VITE_BASE com o caminho do repositório.
  base: process.env.VITE_BASE || '/VueNautas/',
  plugins: [vue()],
})