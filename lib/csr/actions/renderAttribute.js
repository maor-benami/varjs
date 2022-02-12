import { f, select, isFunction } from '../../utils/utils.js'
import { observe } from '../oberverable.js'

export default function renderAttribute (attribute, parent, context, childIndex) {
  let [name, value, selector] = attribute
  
  if (name === 'afterMount') {
    return value()
  }
  
  let target = select([childIndex, ...selector.slice(1)], parent)
  
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
