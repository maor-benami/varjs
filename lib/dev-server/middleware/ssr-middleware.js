import URLMiddleware from './url-middleware.js'
import ssr from '../../ssr/ssr.js'
import { createRouterObj } from '../../router/router.js'

const suffix = '</body></html>'

export default (req, res, Module, context = {}, config) => {
  let { ext } = URLMiddleware(req, res)

  if (!ext) {
    context.router = createRouterObj(`http://${req.headers.host}${req.url}`)
    const str = ssr(Module, context, config)

    res.writeHead(200)
    res.write('<!doctype html>\n' + str)
    res.end()
  }

};
