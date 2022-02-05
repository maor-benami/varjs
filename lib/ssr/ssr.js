let isFunction = (obj) => obj.constructor.name === 'Function';

function renderComponentToString (component) {
  let [tmpl, children, attributes] = component
  let result = ''
  let attributeCount = 0
  
  for (let chunk of tmpl) {
    if (chunk === ' ') {
      let attribute = attributes[attributeCount]
      let [name, value] = attribute
      
      if (isFunction(value)) {
        result += ` ${name}="${String(value())}"`
      } else {
        result += ` ${name}="${String(value)}"`
      }
      
      attributeCount++
    } else {
      result += chunk
    }
  }
  
  return result
}

export default function ssr (subject) {
  return renderComponentToString(subject)
}