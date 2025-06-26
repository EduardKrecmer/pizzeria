// Zjednodušená Vite konfigurácia, ktorá povolí prístup z Replit domény
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@store': path.resolve(__dirname, 'src/store')
    }
  },
  server: {
    host: "0.0.0.0",
    port: 5173, // Používame štandardný Vite port
    // Povoľujeme prístup z akejkoľvek Replit domény
    hmr: {
      clientPort: 443
    },
    // Povoľujeme všetkých hostiteľov (najmä pre Replit)
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});