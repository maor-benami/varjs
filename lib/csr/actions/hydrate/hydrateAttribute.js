import { f, select } from '../../utils.js'
import { observe } from '../../oberverable.js'

export default function hydrateAttribute (attribute, parent, context, childIndex) {
  let [name, value, selector] = attribute
  let targetSelector = [childIndex, ...selector.slice(1)]
  let target = select(targetSelector, parent)

  if (name === 'afterMount') {
    return value(target)
  }

  observe(() => {
    let result = f(value)
    if (result) {
      target.setAttribute(name, String(result))
    }
  }, target)
}
