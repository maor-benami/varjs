import { select } from '../utils.js'
import renderSubject from './renderSubject.js'

export function renderCommentPlaceholder (parent, index) {
  let comment = document.createComment(String(index))
  let next = parent.childNodes[index]
  parent.insertBefore(comment, next)
}

export default function renderChild (child, parent, context, childIndex) {
  let [value, selector] = child
  let targetSelector = [childIndex, ...selector.slice(1, -1)]
  let target = select(targetSelector, parent)
  let index = selector.at(-1)

  renderSubject(value, target, context, index)
}
