import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // Reduce the number of JSX transformations to improve performance
    jsxRuntime: 'automatic',
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 2000, // Increase chunk size warning limit
    minify: 'esbuild', // Use esbuild for minification (faster than terser)
    sourcemap: false, // Disable sourcemaps to reduce memory usage
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['@tabler/icons-react', 'lucide-react'],
          utils: ['date-fns', 'axios', 'zod'],
          state: ['zustand'],
        },
      },
    },
  },
  optimizeDeps: {
    // Include all major dependencies to pre-bundle them
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@tabler/icons-react',
      'lucide-react',
      'zustand',
      'axios',
      'date-fns',
      'zod',
      '@hookform/resolvers',
      'react-hook-form',
      'framer-motion'
    ],
    // Force dependency pre-bundling
    force: true,
    // Esbuild options for dependency optimization
    esbuildOptions: {
      target: 'es2020',
      // Reduce the number of features to improve performance
      supported: {
        'top-level-await': false,
      },
    },
  },
  server: {
    hmr: {
      overlay: false, // Disable HMR overlay to reduce memory usage
      timeout: 5000, // 5 seconds
    },
    fs: {
      strict: false, // Allow serving files from outside the project root
    },
    // Reduce the number of WebSocket connections
    watch: {
      usePolling: true, // Use polling instead of file system events
      interval: 1000, // Poll every second
    },
    // Reduce memory usage by limiting concurrent connections
    middlewareMode: false,
  },
  // Disable CSS processing to reduce memory usage
  css: {
    devSourcemap: false,
  },
  // Reduce the amount of information logged to the console
  logLevel: 'error',
  // Clear screen on restart to reduce console output
  clearScreen: true,
})