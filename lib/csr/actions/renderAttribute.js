import { f, select } from '../../utils/utils.js'
import { isFunction } from '../../utils/is.js'
import { observe } from '../oberverable.js'

export default function renderAttribute (attribute, parent, context, index) {
  let [name, value, selector] = attribute
  
  if (name === 'afterMount') {
    return value()
  }
  
  let target = select([index, ...selector.slice(1)], parent)
  
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
