import { f, isFunction, makeProps } from '../../utils/utils.js'

function attributeToString (attribute) {
  let [name, value] = attribute
  let result = f(value)
  return !result ? '' : ` ${name}="${String(result)}"`
}

export default function renderToChunks (subject, context, config) {
  if (!subject) return ''

}
