import URLMiddleware from './url-middleware.js'
import htmlMinifier from 'html-minifier'

export default (req, res, html = '') => {
  let { ext } = URLMiddleware(req, res)

  if (!ext) {
    res.writeHead(200)
    res.end(htmlMinifier.minify(html, {
      collapseWhitespace: true,
      removeAttributeQuotes: true,
    }))
  }

};
