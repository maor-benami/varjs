import fs from 'fs';
import jsxParser  from '../../parser/parser.js';
import URLMiddleware from './url-middleware.js';
import mimes from '../mimes.js';

export default (req, res) => {
  let { ext } = URLMiddleware(req, res);

  let result = '';

  if (ext) {
    try {
      result = fs.readFileSync(req.url.substr(1), 'utf8');
    } catch (err) {}

    res.writeHead(200, { 'Content-Type': mimes[ext] });

    if (ext === 'js') {
      result = jsxParser(result);
    }

    res.write(result);
    res.end();
  }
};
