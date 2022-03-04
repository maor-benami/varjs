import { isCommentNode } from '../utils.js'
import removeChild from './removeChild.js'

export default function renderText (value, parent, context, index) {
  let target = parent.childNodes[index]
  let text = String(value)

  function createTextNode() {
    parent.insertBefore(document.createTextNode(text), target)
  }

  if (target) {
    if (isCommentNode(target)) {
      createTextNode()
      removeChild(target)
    } else {
      target.nodeValue = text
    }
  } else {
    createTextNode()
  }
}
