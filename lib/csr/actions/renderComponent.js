import renderTmpl from './renderTmpl.js'
import renderAttribute from './renderAttribute.js'
import renderEvent from './renderEvent.js'
import renderChild from './renderChild.js'
import removeChild  from './removeChild.js'

export default function renderComponent (subject, parent, context, index = 0) {
  let [tmpl, children, attributes, events] = subject
  let exists = parent.childNodes[index]
  
  renderTmpl(tmpl, parent, context, index)
  
  children?.forEach((child) => {
    renderChild(child, parent, context, index)
  })
  
  attributes?.forEach((attribute) => {
    renderAttribute(attribute, parent, context, index)
  })
  
  events?.forEach((event) => {
    renderEvent(event, parent, context, index)
  })
  
  if (exists?.nodeType === 8 ){
    removeChild(exists)
  }
}
