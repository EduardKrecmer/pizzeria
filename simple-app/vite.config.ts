import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    // Povoľujeme prístup z Replit domény
    hmr: {
      clientPort: 443
    },
    // Povoľujeme všetkých hostiteľov (najmä pre Replit)
    cors: true,
    // Povoliť všetky hosty vrátane špecifickej Replit domény
    allowedHosts: ['localhost', '.replit.dev', '.repl.co', '2a212100-380b-4df3-a78e-ec2c1f843da9-00-1k3cd0rc2caqr.janeway.replit.dev'],
    fs: {
      strict: false,
    },
  },
})