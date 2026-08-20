import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { listToolPayments, verifyFlutterwavePayment } from './server/flutterwavePayments.js'
import {
  claimGuestConstructionProjects,
  createConstructionProject,
  getConstructionProject,
  listConstructionProjects,
} from './server/constructionProjects.js'

function readJsonBody(req: import('http').IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function sendJson(res: import('http').ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function flutterwaveApiPlugin(): Plugin {
  return {
    name: 'flutterwave-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]
        const query = req.url?.includes('?') ? new URLSearchParams(req.url.split('?')[1]) : new URLSearchParams()

        if (url === '/api/tool-payments') {
          if (req.method !== 'GET') {
            sendJson(res, 405, { ok: false, error: 'Method not allowed' })
            return
          }
          try {
            const result = await listToolPayments(req.headers.authorization)
            sendJson(res, result.status || (result.ok ? 200 : 400), result)
          } catch {
            sendJson(res, 500, { ok: false, error: 'Could not load payments.' })
          }
          return
        }

        if (url === '/api/construction-projects/create' && req.method === 'POST') {
          try {
            const raw = await readJsonBody(req)
            const body = raw ? JSON.parse(raw) : {}
            const result = await createConstructionProject({
              title: body.title,
              specs: body.specs,
              authToken: req.headers.authorization,
            })
            sendJson(res, result.status || (result.ok ? 200 : 400), result)
          } catch {
            sendJson(res, 500, { ok: false, error: 'Could not create project.' })
          }
          return
        }

        if (url === '/api/construction-projects/list' && req.method === 'GET') {
          try {
            const result = await listConstructionProjects({
              authToken: req.headers.authorization,
            })
            sendJson(res, result.status || (result.ok ? 200 : 400), result)
          } catch {
            sendJson(res, 500, { ok: false, error: 'Could not load projects.' })
          }
          return
        }

        if (url === '/api/construction-projects/get' && req.method === 'GET') {
          try {
            const accessHeader = req.headers['x-project-access']
            const result = await getConstructionProject({
              projectId: query.get('id') || query.get('projectId') || undefined,
              authToken: req.headers.authorization,
              accessToken: Array.isArray(accessHeader) ? accessHeader[0] : accessHeader,
            })
            sendJson(res, result.status || (result.ok ? 200 : 400), result)
          } catch {
            sendJson(res, 500, { ok: false, error: 'Could not load project.' })
          }
          return
        }

        if (url === '/api/construction-projects/claim' && req.method === 'POST') {
          try {
            const result = await claimGuestConstructionProjects({
              authToken: req.headers.authorization,
            })
            sendJson(res, result.status || (result.ok ? 200 : 400), result)
          } catch {
            sendJson(res, 500, { ok: false, error: 'Could not claim projects.' })
          }
          return
        }

        if (url !== '/api/verify-flutterwave') {
          next()
          return
        }

        if (req.method !== 'POST') {
          sendJson(res, 405, { ok: false, error: 'Method not allowed' })
          return
        }

        try {
          const raw = await readJsonBody(req)
          const body = raw ? JSON.parse(raw) : {}
          const result = await verifyFlutterwavePayment(body)
          sendJson(res, result.ok ? 200 : 400, result)
        } catch {
          sendJson(res, 500, { ok: false, error: 'Verification failed.' })
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of [
    'FLUTTERWAVE_SECRET_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ]) {
    if (env[key]) process.env[key] = env[key]
  }
  process.env.NODE_ENV = process.env.NODE_ENV || mode

  return {
  plugins: [react({
    // Reduce the number of JSX transformations to improve performance
    jsxRuntime: 'automatic',
  }), flutterwaveApiPlugin()],
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
    // Pre-bundle on first run only
    force: false,
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
      overlay: true,
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
  logLevel: 'info',
  // Clear screen on restart to reduce console output
  clearScreen: true,
}
})
