import { isFunction, fc } from '../utils/utils.js'
import renderComponentToString from './actions/renderComponentToString.js'

global.Var = {
  fc,
  observable: obj => obj
}

export default function ssr (subject) {
  if (isFunction(subject)) {
    return ssr(subject())
  }
  
  let context = {}
  
  return renderComponentToString(subject, context)
}