import { f } from '../../utils/utils.js'

export default function renderAttributeToString (attribute) {
  let [name, value] = attribute
  let result = f(value)
  return !result ? '' : ` ${name}="${String(result)}"`
}