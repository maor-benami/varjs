import fs from 'fs'
import path from 'path'
import { DevServer, FileWatcher } from '../lib/dev-server/index.js'
import FileMiddleware from '../lib/dev-server/middleware/file-middleware.js'
import HtmlMiddleware from '../lib/dev-server/middleware/html-middleware.js'
import SSRMiddleware from '../lib/dev-server/middleware/ssr-middleware.js'
import jsxParser from '../lib/parser/parser.js'
import config from '../config.js'

new DevServer({
  port: 8000,
  middleware: async function (req, res) {
    const Module = (await (import('../dist/home.js'))).default
    const store = (await (import('../dist/store.js'))).default
    SSRMiddleware(req, res, Module, {
      title: 'context',
      store
    })
    FileMiddleware(req, res, {
      compact: config.compact
    })
  },
})

new DevServer({
  port: 8001,
  middleware: async function (req, res) {
    HtmlMiddleware(req, res, fs.readFileSync('server/index.html', 'utf8'))
    FileMiddleware(req, res, {
      compact: config.compact
    })
  },
})

new FileWatcher({
  dir: 'app',
  callback: (event, { file, ext, body }) => {
    if (ext === 'js') {
      fs.writeFileSync(
        path.resolve('dist', file),
        jsxParser(body),
        'utf8',
      )
    }
  },
})
