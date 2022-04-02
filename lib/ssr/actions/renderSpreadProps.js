import { isFunction } from '../../shared/is.js'

export default function renderSpreadProps(props) {
  let result = ''

  Object.keys(props).forEach((prop) => {
    if (prop === 'children' || prop.startsWith('on')) return
    let res = isFunction(props[prop]) ? props[prop]() : props[prop]
    result += ` ${prop}="${res}"`
  })
  console.log(result)
  return result
}
