import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://abuubkar.github.io/react-concepts/ via GitHub Pages.
  base: '/react-concepts/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
