import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: './index.ts'
    }
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
