import URLMiddleware from './url-middleware.js';
import htmlMinifier from 'html-minifier'

export default (req, res, html = '') => {
  let { chunks } = URLMiddleware(req, res);

  if (!chunks.length || req.url.charAt(1) === '?') {
    res.writeHead(200);
    res.end(htmlMinifier.minify(html, {
      collapseWhitespace: true,
      removeAttributeQuotes: true,
    }));
  }
};
