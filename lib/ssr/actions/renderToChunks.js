import { isArray, isComponent, isFunction, isText } from '../../shared/is.js'
import { makeContext, } from '../../shared/utils.js'
import renderAttributeToString from './renderAttributeToString.js'
import renderToString from './renderToString.js'

export default function renderToChunks (subject, context, config) {
  let chunks = []

  function renderFunction (subject, context, config) {
    let [func, props] = subject

    makeContext(props, context)

    if (props?.beforeMount) {
      context.mounts.push(props.beforeMount)
    }

    if (!config.collectMounts) {
      renderSubject(func(props, context), context, config)
    }
  }

  function renderComponent (subject, context, config) {
    let [tmpl, children, attributes] = subject

    let attributeCount = 0
    let childrenCount = 0

    function renderChild (child, index) {
      let [value, selector] = child
      let subject = value

      if (isFunction(value)) {
        let result = value()

        if (isArray(result)) {
          result.forEach(item => {

            renderSubject(item, context, {
              ...config,
              collectMounts: true,
            })
          })
        }

        if (!config.collectMounts) {
          chunks.push(() => renderToString(value, context, config, index))
        }
      } else if (value === false) {
        let index = selector[selector.length - 1]
        if (!config.collectMounts) {
          chunks.push(`<!--${index}-->`)
        }
      } else if (Array.isArray(subject)) {
        if (isFunction(subject[0])) {
          renderFunction(subject, context, config)
        } else {
          if (subject[0] && typeof subject[0][0] === 'string') {
            if (!config.collectMounts) {
              renderSubject(subject, context, config)
            }
          } else {
            if (!config.collectMounts) {
              subject.forEach(item => {
                renderSubject(item, context, config)
              })
            }
          }
        }
      } else {
        chunks.push(String(subject))
      }
    }

    function handleChunk (chunk) {
      if (chunk === ' ') {
        let attribute = attributes[attributeCount]
        if (!config.collectMounts) {
          chunks.push(renderAttributeToString(attribute))
        }
        attributeCount++
      } else if (chunk === '') {
        let child = children[childrenCount]
        renderChild(child, childrenCount)
        childrenCount++
      } else {
        if (!config.collectMounts) {
          chunks.push(chunk)
        }
      }
    }

    tmpl.forEach(handleChunk)
  }

  function renderSubject (subject, context, config) {
    if (!subject) return

    if (isFunction(subject)) {
      renderSubject(subject(), context, config)
    } else if (isText(subject)) {
      if (!config.collectMounts) {
        chunks.push(subject)
      }
    } else if (isComponent(subject)) {
      renderComponent(subject, context, config)
    } else if (isFunction(subject[0])) {
      renderFunction(subject, context, config)
    } else {
      if (!config.collectMounts) {
        subject.forEach(item => {
          renderSubject(item, context, config)
        })
      }
    }
  }

  if (isComponent(subject)) {
    renderSubject(subject, context, config)
  }

  return chunks
}
