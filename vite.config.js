import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
// path added

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
})