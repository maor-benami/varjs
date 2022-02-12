import { isFunction } from '../../../utils/is.js'
import { f, select } from '../../../utils/utils.js'
import { observe } from '../../oberverable.js'

export default function hydrateAttribute (attribute, parent, context, childIndex) {
  let [name, value, selector] = attribute
  
  if (name === 'afterMount') {
    return value()
  }
  
  let targetSelector = [childIndex, ...selector.slice(1)]
  let target = select(targetSelector, parent)
  
  if (isFunction(value)) {
    observe(() => {
      let result = f(value)
      if (result) {
        target.setAttribute(name, String(result))
      }
    }, target)
  }
}
