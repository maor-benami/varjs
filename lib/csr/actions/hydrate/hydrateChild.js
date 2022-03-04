import { isComponent, isFunction, isText } from '../../../shared/is.js'
import { select } from '../../utils.js'
import { observe } from '../../oberverable.js'
import hydrateSubject from './hydrateSubject.js'
import renderList from '../renderList.js'
import renderSubject from '../renderSubject.js'
import renderText from '../renderText.js'
import removeChild from '../removeChild.js'

function observeChild (value, parent, context, index) {
  if (value === false) {
    if (!parent.slots) {
      parent.slots = {}
    }

    if (parent.slots[index]) {
      removeChild(parent.childNodes[index])
      delete parent.slots[index]
    }

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

export default function hydrateChild (child, parent, context, childIndex) {
  let [value, selector] = child
  let targetParent = parent
  let targetSelector = selector.slice(1, -1)

  if (!parent.tagName) {
    targetParent = parent.childNodes[1]
  } else {
    targetSelector.unshift(childIndex)
  }

  let target = select(targetSelector, targetParent)
  let index = selector.at(-1)

  if (isFunction(value)) {
    observe(() => {
      observeChild(value(), target, context, index)
    }, target)
  } else {
    target = target.childNodes[index]

    if (target) {
      hydrateSubject(value, target, context, index)
    } else {
      console.log(77)
    }
  }
}
