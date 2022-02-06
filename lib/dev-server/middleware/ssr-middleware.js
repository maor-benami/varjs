import URLMiddleware from './url-middleware.js';
import ssr from '../../ssr/ssr.js';

export default async (req, res, mod) => {
  let { chunks } = URLMiddleware(req, res);

  if (!chunks.length || req.url.charAt(1) === '?') {
    let Module = (await mod).default;
    const str = await ssr(Module);

    res.writeHead(200);
    res.write('<!doctype html>\n' + str);
    res.end();
  }
};
