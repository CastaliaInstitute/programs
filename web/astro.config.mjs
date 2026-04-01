// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://programs.castalia.institute',
  base: '/',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
})
