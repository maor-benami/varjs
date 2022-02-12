import { select } from '../../../utils/utils.js'

export default function hydrateEvent (event, parent, context, childIndex) {
  let [name, func, selector] = event
  let targetSelector = [childIndex, ...selector.slice(1)]
  let target = select(targetSelector, parent)
  
  target.addEventListener(name, func)
}
