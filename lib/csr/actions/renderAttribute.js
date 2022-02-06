import select, { isFunction } from '../../utils/utils.js'
import { observe } from '../oberverable.js'

export default function renderAttribute (attribute, parent, context, childIndex) {
  let [name, value, selector] = attribute
  let target = select([childIndex, ...selector.slice(1)], parent)
  
  let callback = () => {
    target.setAttribute(name, String(value()))
  }
  
  if (isFunction(value)) {
    observe(() => {
      callback()
    }, target)
  } else {
    callback()
  }
}
