import URLMiddleware from './url-middleware.js'
import ssr from '../../ssr/ssr.js'
import { createRouterObj } from '../../router/router.js'

const suffix = '</body></html>'

export default async (req, res, Module, context = {}, config) => {
  let { ext } = URLMiddleware(req, res)
  
  if (!ext) {
    context.router = createRouterObj(`http://${req.headers.host}${req.url}`)
    const str = await ssr(Module, context, config)
    const str1 = str.slice(0, -suffix.length)
    const str2 = str.slice(str1.length)
    
    delete context.router
    delete context.mounts
    const contextStr = `<script>window._CONTEXT_ = ${JSON.stringify(context)}</script>`
    
    res.writeHead(200)
    res.write('<!doctype html>\n' + str1 + contextStr + str2)
    res.end()
  }
  
};
