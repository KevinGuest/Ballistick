'use strict'

/**
 * Serves htdocs/ for local testing without Apache.
 * Open http://127.0.0.1:8080/ after npm run web
 */

const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = parseInt(process.env.WEB_PORT || '8080', 10)
const ROOT = path.join(__dirname, '../../htdocs')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.swf': 'application/x-shockwave-flash',
  '.json': 'application/json',
  '.ini': 'text/plain; charset=utf-8',
  '.dat': 'text/plain; charset=utf-8',
  '.csv': 'text/csv',
  '.php': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
}

http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  const filePath = path.normalize(path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath))

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403)
    return res.end('Forbidden')
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      return res.end('Not found')
    }
    const ext = path.extname(filePath).toLowerCase()
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    })
    res.end(data)
  })
}).listen(PORT, '127.0.0.1', () => {
  console.log(`[web] http://127.0.0.1:${PORT}/`)
})
