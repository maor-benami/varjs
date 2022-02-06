import { isFunction } from '../../utils/utils.js'

function attributeToString (attribute) {
  let [name, value] = attribute
  
  let _value = isFunction(value) ? value() : value
  return ` ${name}="${String(_value)}"`
}

function makeProps (props, context) {
  let result = {}
  
  if (props) {
    Object.keys(props).forEach(key => {
      result[key] = props[key]
    })
    
    if (props.context) {
      Object.keys(props.context).forEach(key => {
        context[key] = props.context[key]
      })
    }
  }
  
  Object.keys(context).forEach(key => {
    if (!result.context) {
      result.context = {}
    }
    result.context[key] = context[key]
  })
  
  return result
}

export default async function renderComponentToString (component, context) {
  let [tmpl, children, attributes, events] = component
  let beforeMount = events?.find(event => event[0] === 'beforemount')
  beforeMount = beforeMount && beforeMount[1]
  
  if (beforeMount) {
    await beforeMount()
  }
  
  let result = ''
  let attributeCount = 0
  let childrenCount = 0
  
  async function childToString (child) {
    let [value] = child
    let subject = isFunction(value) ? value() : value
    
    if (subject === false) {
      return ''
    } else if (Array.isArray(subject)) {
      if (isFunction(subject[0])) {
        let [func, props] = subject
        let _props = makeProps(props, context)
        
        return renderComponentToString(func(_props), context)
      } else {
        if (typeof subject[0][0] === 'string') {
          return renderComponentToString(subject, context)
        } else {
          /*return subject.map(item => {
            return ssr(item)
          })*/
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
      let prevChunk = tmpl[i - 1]
      let child = children[childrenCount]
      
      if (prevChunk === '') {
        result += '<!---->'
      }
      
      result += await childToString(child)
      
      childrenCount++
    } else {
      result += chunk
    }
  }
  
  return result
}
