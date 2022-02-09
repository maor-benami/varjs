import { f, isFunction, makeProps } from '../../utils/utils.js'

function attributeToString (attribute) {
  let [name, value] = attribute
  let result = f(value)
  return !result ? '' : ` ${name}="${String(result)}"`
}

export default async function renderComponentToString (subject, context) {
  if (!subject) return ''

  if (isFunction(subject)) {
    return renderComponentToString(subject(), context)
  }

  let [tmpl, children, attributes, events] = subject
  let beforeMount = events?.find(event => event[0] === 'beforemount')
  beforeMount = beforeMount && beforeMount[1]
  
  if (beforeMount) {
    await beforeMount()
  }
  
  let result = ''
  let attributeCount = 0
  let childrenCount = 0
  
  async function childToString (child) {
    let [value, selector] = child
    let subject = f(value)
    
    if (subject === false) {
      let index = selector[selector.length - 1]
      return `<!--${index}-->`
    } else if (Array.isArray(subject)) {
      if (isFunction(subject[0])) {
        let [func, props] = subject
        let _props = makeProps(props, context)
        
        return renderComponentToString(func(_props), context)
      } else {
        if (typeof subject[0][0] === 'string') {
          return renderComponentToString(subject, context)
        } else {
          return (await Promise.all(
            subject.map(item => {
              return renderComponentToString(item, context)
            })
          )).join('')
        }
      }
    } else {
      return String(subject)
    }
  }
  
  for (let i = 0; i < tmpl.length; i++) {
    let chunk = tmpl[i]
    
    if (chunk === ' ') {
      let attribute = attributes[attributeCount]
      result += attributeToString(attribute)
      
      attributeCount++
    } else if (chunk === '') {
      let child = children[childrenCount]
      /*let prevChunk = tmpl[i - 1]
      
      if (prevChunk === '') {
        result += '<!---->'
      }*/
      
      result += await childToString(child)
      
      childrenCount++
    } else {
      result += chunk
    }
  }
  
  return result
}
