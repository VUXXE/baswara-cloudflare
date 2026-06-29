// Vercel Serverless Function — TanStack Start SSR handler
// Static assets (JS/CSS/images) are served directly by Vercel CDN from dist/client/
// This function only handles SSR page rendering and server functions

import serverEntry from '../dist/server/server.js'

export default async function handler(req, res) {
  const host = req.headers.host || 'localhost'
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const url = new URL(req.url, `${protocol}://${host}`)

  const webRequest = new Request(url.toString(), {
    method: req.method,
    headers: new Headers(req.headers),
    body:
      req.method !== 'GET' && req.method !== 'HEAD'
        ? new ReadableStream({
            start(controller) {
              req.on('data', (chunk) => controller.enqueue(chunk))
              req.on('end', () => controller.close())
              req.on('error', (err) => controller.error(err))
            },
          })
        : undefined,
    duplex: 'half',
  })

  let webResponse
  try {
    webResponse = await serverEntry.fetch(webRequest)
  } catch (err) {
    console.error('[SSR Error]', err)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain')
    res.end('Internal Server Error')
    return
  }

  res.statusCode = webResponse.status
  webResponse.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })

  if (webResponse.body) {
    const reader = webResponse.body.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(value)
    }
  }
  res.end()
}
