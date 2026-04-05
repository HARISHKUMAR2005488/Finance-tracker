import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('recharts')) return 'recharts-core';
          if (id.includes('d3-') || id.includes('/victory-vendor/')) return 'charts-vendor';
          if (id.includes('lucide-react')) return 'icons';

          return undefined;
        },
      },
    },
  },
})
