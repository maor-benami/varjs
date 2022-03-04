import { f, select } from '../utils.js'
import { isFunction } from '../../shared/is.js'
import { observe } from '../oberverable.js'

export default function renderAttribute (attribute, parent, context, index) {
  let [name, value, selector] = attribute
  let target = select([index, ...selector.slice(1)], parent)

  if (name === 'afterMount') {
    return value(target)
  }

  let callback = () => {
    let result = f(value)
    if (result) {
      target.setAttribute(name, String(result))
    }
  }
  
  if (isFunction(value)) {
    observe(() => {
      callback()
    }, target)
  } else {
    callback()
  }
}
