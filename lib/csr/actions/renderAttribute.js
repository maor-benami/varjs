import { select, isFunction } from '../../utils/utils.js'
import { observe } from '../oberverable.js'

export default function renderAttribute (attribute, parent, context, childIndex) {
  let [name, value, selector] = attribute
  let target = select([childIndex, ...selector.slice(1)], parent)
  
  let callback = () => {
    let result = value()
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
