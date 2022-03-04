import hydrateAttribute from './hydrateAttribute.js'
import hydrateEvent from './hydrateEvent.js'
import hydrateChild  from './hydrateChild.js'

export default function hydrateComponent (subject, parent, context, index = 0) {
  let [, children, attributes, events] = subject
  
  children?.forEach((child) => {
    hydrateChild(child, parent.parentNode, context, index)
  })
  
  attributes?.forEach((attribute) => {
    hydrateAttribute(attribute, parent.parentNode, context, index)
  })
  
  events?.forEach((event) => {
    hydrateEvent(event, parent.parentNode, context, index)
  })
}
