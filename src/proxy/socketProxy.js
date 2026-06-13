'use strict'

/**
 * WebSocket ↔ TCP bridge for Ruffle (browser Flash cannot open raw TCP sockets).
 * Maps ws://127.0.0.1:8438 → tcp://127.0.0.1:1138 (lobby/game server 100)
 * Maps ws://127.0.0.1:8439 → tcp://127.0.0.1:1139 (game server 101)
 */

const WebSocket = require('ws')
const net = require('net')

const PROXIES = [
  { wsPort: 8438, tcpHost: '127.0.0.1', tcpPort: 1138 },
  { wsPort: 8439, tcpHost: '127.0.0.1', tcpPort: 1139 },
]

function bridge(ws, tcp) {
  ws.on('message', (msg) => {
    if (tcp.destroyed) return
    const data = Buffer.isBuffer(msg) ? msg.toString('utf8') : String(msg)
    tcp.write(data)
  })

  tcp.on('data', (chunk) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(chunk.toString())
  })

  const close = () => {
    try { tcp.destroy() } catch (_) { /* ignore */ }
    try { ws.close() } catch (_) { /* ignore */ }
  }

  ws.on('close', close)
  ws.on('error', close)
  tcp.on('close', close)
  tcp.on('error', close)
}

for (const { wsPort, tcpHost, tcpPort } of PROXIES) {
  const wss = new WebSocket.Server({ host: '127.0.0.1', port: wsPort })

  wss.on('connection', (ws) => {
    const tcp = net.connect(tcpPort, tcpHost)
    tcp.setEncoding('utf8')
    bridge(ws, tcp)
  })

  wss.on('listening', () => {
    console.log(`[socket-proxy] ws://127.0.0.1:${wsPort} → tcp://${tcpHost}:${tcpPort}`)
  })

  wss.on('error', (err) => {
    console.error(`[socket-proxy] port ${wsPort} error:`, err.message)
  })
}
