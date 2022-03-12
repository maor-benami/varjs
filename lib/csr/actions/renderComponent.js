import { isCommentNode, querySelector } from '../utils.js'
import renderTmpl  from './renderTmpl.js'
import renderAttribute from './renderAttribute.js'
import renderEvent from './renderEvent.js'
import renderChild from './renderChild.js'
import removeChild from './removeChild.js'

export default function renderComponent (subject, parent, context, index = 0) {
  let [tmpl, children, attributes, events] = subject
  let node = parent.childNodes[index]
  let isHtml = tmpl[0] === '<html'
  let _parent = isHtml ? parent.ownerDocument : parent

  if (node) {
    if (isCommentNode(node)) {
      removeChild(node)
    } else {
      let exists = querySelector(parent, index)
      if (exists) return
    }
  }

  if (!isHtml) {
    renderTmpl(tmpl, _parent, context, index)
  }

  children?.forEach((child) => {
    renderChild(child, _parent, context, index)
  })

  attributes?.forEach((attribute) => {
    renderAttribute(attribute, _parent, context, index)
  })

  events?.forEach((event) => {
    renderEvent(event, _parent, context, index)
  })
}
