import { f, fc } from '../utils/utils.js'
import renderComponentToString from './actions/renderComponentToString.js'

global.Var = {
  fc,
  observable: obj => obj
}

export default function ssr (subject) {
  let context = {}
  
  return renderComponentToString(f(subject), context)
}