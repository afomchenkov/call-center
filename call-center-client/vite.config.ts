import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules'],
  },
  resolve: {
    alias: {
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@models': path.resolve(__dirname, 'src/models'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@state': path.resolve(__dirname, 'src/state'),
      '@schemas': path.resolve(__dirname, 'src/schemas'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
