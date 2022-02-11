import { f, fc } from '../utils/utils.js'
import renderToString from './actions/renderToString.js'

global.Var = {
  fc,
  observable: obj => obj
}

export default function ssr (subject, context = {}, config) {
  return renderToString(f(subject), context, config)
}
