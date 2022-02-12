import { f } from '../../utils/utils.js'

export default function renderAttributeToString (attribute) {
  let [name, value] = attribute
  
  if (name === 'afterMount') {
    return ''
  }
  
  let result = f(value)
  return !result ? '' : ` ${name}="${String(result)}"`
}