import renderTmpl from './renderTmpl.js'
import renderAttribute from './renderAttribute.js'
import renderEvent from './renderEvent.js'
import renderChild, { removeChild } from './renderChild.js'
import { getKey, isFunction, makeProps } from '../../utils/utils.js'
import { observe } from '../oberverable.js'

export default function renderComponent (subject, parent, context, index = 0) {
  if (!subject) {
    return
  }

  if (isFunction(subject)) {
    return observe(() => {
      let result = subject()
      let target = parent
      let childTarget = target.childNodes[index]

      if (!target.slots) {
        target.slots = {}
      }

      if (!result) {
        if (target.slots[index]) {
          removeChild(childTarget)
        }

        let comment = document.createComment(String(index))
        let next = target.childNodes[index]
        target.insertBefore(comment, next)
      } else {
        let key = getKey(result)
        let exists = parent.querySelector(`:scope > [key="${key}"]`)
        if (!exists) {
          if (childTarget?.nodeType === 8) {
            removeChild(childTarget)
          }
          renderComponent(result, parent, context, index)
        }
      }

      if (!target.slots[index]) {
        target.slots[index] = true
      }
    }, parent)
  }

  if (isFunction(subject[0])) {
    makeProps(subject[1], context)
    return renderComponent(subject[0](subject[1], context), parent, context, index)
  }

  let [tmpl, children, attributes, events] = subject
  let beforeMount, afterMount
  let domEvents = []

  events?.forEach((event) => {
    if (event[0] === 'beforemount') {
      beforeMount = event[1]
    } else if (event[0] === 'aftermount') {
      afterMount = event[1]
    } else {
      domEvents.push(() => renderEvent(event, parent, context, index))
    }
  })

  let callback = () => {
    renderTmpl(tmpl, parent, context, index)

    children?.forEach((child) => {
      renderChild(child, parent, context, index)
    })

    attributes?.forEach((attribute) => {
      renderAttribute(attribute, parent, context, index)
    })

    domEvents.forEach(eff => eff())

    if (afterMount) {
      afterMount()
    }
  }

  if (beforeMount) {
    beforeMount().then(callback)
  } else {
    callback()
  }

  return parent
}
