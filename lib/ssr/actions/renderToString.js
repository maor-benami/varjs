import { isArray, isComponent, isFunction } from '../../shared/is.js'
import { f, makeContext } from '../../shared/utils.js'
import renderAttributeToString from './renderAttributeToString.js'

export default function renderToString (subject, context, config, index = 0) {
  let result = ''

  function renderSubjectToString (subject, context, config, index) {
    if (!subject) {
      result += `<!--${index}-->`
      return
    }

    if (isFunction(subject)) {
      return renderSubjectToString(subject(), context, config, index)
    }

    function renderArrayToString (subject, context, config) {
      subject.forEach(item => {
        result += renderToString(item, context, config)
      })
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
              renderArrayToString(subject, context, config)
            }
          }
        } else {
          result += String(subject)
        }
      }

      tmpl.forEach(chunk => {
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
      })
    }

    if (isComponent(subject)) {
      renderComponentToString(subject, context, config)
    } else if (isFunction(subject[0])) {
      renderFunctionToString(subject)
    } else if (isArray(subject)) {
      renderArrayToString(subject, context, config)
    } else {

      result += subject
    }
  }

  renderSubjectToString(subject, context, config, index)

  return result
}
