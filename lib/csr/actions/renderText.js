import { isCommentNode, isTextNode } from '../utils.js'
import removeChild from './removeChild.js'

export default function renderText (value, parent, context, index) {
  let text = String(value)

  if (isTextNode(parent)) {
    return setNodeValue(parent, text)
  }

  let target = parent.childNodes[index]

  function createTextNode () {
    parent.insertBefore(document.createTextNode(text), target)
  }

  function setNodeValue (node, value) {
    if (node.nodeValue === value) return
    node.nodeValue = value
  }

  if (target) {
    if (isCommentNode(target)) {
      createTextNode()
      removeChild(target)
    } else {
      setNodeValue(target, text)
    }
  } else {
    createTextNode()
  }
}
