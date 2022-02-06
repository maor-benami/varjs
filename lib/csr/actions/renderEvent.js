import select from '../../utils/utils.js'

export default function renderEvent (event, parent, context, childIndex) {
  let [name, func, selector] = event
  let target = select([childIndex, ...selector.slice(1)], parent)
  target.addEventListener(name, func)
}
