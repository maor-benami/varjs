import URLMiddleware from './url-middleware.js'
import ssr from '../../ssr/ssr.js'
import { createRouterObj } from '../../router/router.js'

export default async (req, res, Module) => {
  let { ext } = URLMiddleware(req, res)

  if (!ext) {
    const str = await ssr(Module, {
      router: createRouterObj(`http://${req.headers.host}${req.url}`)
    })

    res.writeHead(200)
    res.write('<!doctype html>\n' + str)
    res.end()
  }

};
