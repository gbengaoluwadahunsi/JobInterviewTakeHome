import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { config as dotenvConfig } from 'dotenv'

// Load .env into process.env so serverless functions can access it
const dotenvResult = dotenvConfig()
if (dotenvResult.parsed) {
  // Ensure all vars are on process.env (some Node versions need explicit assignment)
  Object.assign(process.env, dotenvResult.parsed)
}

// Plugin to emulate Vercel serverless functions during local dev
function vercelApiPlugin() {
  return {
    name: 'vercel-api-emulator',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Only intercept /api/* routes
        if (!req.url?.startsWith('/api/')) return next()

        // Derive the handler file from the URL, e.g. /api/generate -> ./api/generate.js
        const route = req.url.split('?')[0]          // strip query string
        const handlerPath = `.${route}.js`

        try {
          // Dynamically import the handler (with cache-busting for HMR)
          const mod = await server.ssrLoadModule(handlerPath)
          const handler = mod.default

          // Build a lightweight req/res that mimics Vercel's API shape
          let body = ''
          await new Promise((resolve) => {
            req.on('data', (chunk) => { body += chunk })
            req.on('end', resolve)
          })

          try {
            req.body = body ? JSON.parse(body) : {}
          } catch {
            req.body = {}
          }

          // Create a chainable res mock that Vercel serverless functions expect
          const originalEnd = res.end.bind(res)
          res.status = (code) => { res.statusCode = code; return res }
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json')
            originalEnd(JSON.stringify(data))
          }

          await handler(req, res)
        } catch (err) {
          console.error(`[api-emulator] Error handling ${req.url}:`, err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Internal server error' }))
        }
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiPlugin()],
})
