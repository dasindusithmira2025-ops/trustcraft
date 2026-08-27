// Standalone server: the API plus the built frontend from dist/.
// In development Vite serves the frontend and mounts the same handler as
// middleware (see apiPlugin in vite.config.ts), so this file is only needed
// after `pnpm build`.

import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { dirname, extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleApi } from './api.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const PORT = Number(process.env.PORT || 8443)

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.map': 'application/json',
}

function serveStatic(req, res) {
  if (!existsSync(DIST)) {
    res.writeHead(503, { 'content-type': 'text/plain' })
    return res.end('No build found. Run `pnpm build` first, or use `pnpm dev`.')
  }

  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  // normalize collapses any ../ before it can escape dist.
  const candidate = join(DIST, normalize(urlPath))
  const file = candidate.startsWith(DIST) && existsSync(candidate) && statSync(candidate).isFile()
    ? candidate
    : join(DIST, 'index.html')

  res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' })
  createReadStream(file).pipe(res)
}

createServer(async (req, res) => {
  if (await handleApi(req, res)) return
  serveStatic(req, res)
}).listen(PORT, '0.0.0.0', () => {
  console.log(`TrustCraft running on http://localhost:${PORT}`)
})
