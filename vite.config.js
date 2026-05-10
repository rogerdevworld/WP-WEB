// ============================================================
// vite.config.js — Configuración principal de Vite
// Aquí le decimos a Vite que use el plugin de React
// para poder compilar JSX y componentes de React
// ============================================================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Escuchar en todas las interfaces de red
    port: 5173         // Puerto por defecto de Vite
  }
})
