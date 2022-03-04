import { isCommentNode, select } from '../utils.js'
import { isComponent, isFunction, isText } from '../../shared/is.js'
import { observe } from '../oberverable.js'
import renderSubject from './renderSubject.js'
import renderText from './renderText.js'
import renderList from './renderList.js'
import removeChild from './removeChild.js'

function renderCommentPlaceholder (parent, index) {
  let comment = document.createComment(String(index))
  let next = parent.childNodes[index]
  parent.insertBefore(comment, next)
}

export function observeChild (value, parent, context, index) {
  if (value === false) {
    if (!parent.slots) {
      parent.slots = {}
    }

    if (parent.slots[index]) {
      removeChild(parent.childNodes[index])
      delete parent.slots[index]
    }

    renderCommentPlaceholder(parent, index)

    if (!parent.slots[index]) {
      parent.slots[index] = true
    }
  } else if (isText(value)) {
    renderText(value, parent, context, index)
  } else {
    if (isComponent(value)) {
      renderSubject(value, parent, context, index)
    } else {
      if (parent) {
        renderList(value, parent, context)
      } else {
        console.log(77)
      }
    }
  }
}

export default function renderChild (child, parent, context, childIndex) {
  let [value, selector] = child
  let targetSelector = [childIndex, ...selector.slice(1, -1)]
  let target = select(targetSelector, parent)
  let index = selector.at(-1)

  if (isFunction(value)) {
    observe(() => {
      observeChild(value(), target, context, index)
    }, target)
  } else {
    renderSubject(value, target, context, index)
  }
}
