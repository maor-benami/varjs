import { isArray, isComponent, isFunction } from '../../utils/is.js'
import { f, makeContext } from '../../utils/utils.js'
import renderAttributeToString from './renderAttributeToString.js'

export default function renderToString (subject, context, config) {
  let result = ''
  
  function renderSubjectToString (subject, context, config) {
    if (!subject) return
    
    if (isFunction(subject)) {
      return renderSubjectToString(subject(), context, config)
    }
    
    function renderFunctionToString (subject, context, config) {
      let [func, props] = subject
      makeContext(props, context)
      renderSubjectToString(func(props, context), context, config)
    }
    
    function renderComponentToString (subject, context, config) {
      let [tmpl, children, attributes] = subject
      
      let attributeCount = 0
      let childrenCount = 0
      
      function childToString (child) {
        let [value, selector] = child
        let subject = f(value)
        
        if (subject === false) {
          let index = selector[selector.length - 1]
          result += `<!--${index}-->`
        } else if (Array.isArray(subject)) {
          if (isFunction(subject[0])) {
            renderFunctionToString(subject, context)
          } else {
            if (typeof subject[0][0] === 'string') {
              renderSubjectToString(subject, context, config)
            } else {
              subject.forEach(item => {
                result += renderToString(item, context, config)
              })
            }
          }
        } else {
          result += String(subject)
        }
      }
      
      function handleChunk(chunk) {
        if (chunk === ' ') {
          let attribute = attributes[attributeCount]
          result += renderAttributeToString(attribute)
    
          attributeCount++
        } else if (chunk === '') {
          let child = children[childrenCount]
    
          childToString(child)
    
          childrenCount++
        } else {
          result += chunk
        }
      }
      
      tmpl.forEach(handleChunk)
    }
    
    if (isComponent(subject)) {
      renderComponentToString(subject, context, config)
    } else if (isFunction(subject[0])) {
      renderFunctionToString(subject)
    } else if (isArray(subject)) {
      subject.forEach(item => {
        result += renderToString(item, context, config)
      })
    } else {
      result += subject
    }
  }
  
  renderSubjectToString(subject, context, config)
  
  return result
}
