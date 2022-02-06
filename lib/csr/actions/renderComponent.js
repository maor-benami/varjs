import renderTmpl from './renderTmpl.js'
import renderAttribute from './renderAttribute.js'
import renderEvent from './renderEvent.js'
import renderChild from './renderChild.js'
import { isFunction, makeProps } from '../../utils/utils.js'

export default function renderComponent (subject, parent, context, index = 0) {
  if (isFunction(subject[0])) {
    let extendedProps = makeProps(subject[1], context)
    return renderComponent(subject[0](extendedProps), parent, context, index)
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