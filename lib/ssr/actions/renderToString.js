import { f, isFunction, makeProps } from '../../utils/utils.js'

function attributeToString (attribute) {
  let [name, value] = attribute
  let result = f(value)
  return !result ? '' : ` ${name}="${String(result)}"`
}

export default function renderToString (subject, context, config) {
  if (!subject) return ''

  if (isFunction(subject)) {
    return renderToString(subject(), context, config)
  }

  let [tmpl, children, attributes] = subject

  let result = ''
  let attributeCount = 0
  let childrenCount = 0

  function childToString (child) {
    let [value, selector] = child
    let subject = f(value)

    if (subject === false) {
      let index = selector[selector.length - 1]
      return `<!--${index}-->`
    } else if (Array.isArray(subject)) {
      if (isFunction(subject[0])) {
        let [func, props] = subject
        makeProps(props, context)

        let callback = () => {
          return renderToString(func(props, context), context, config)
        }

        if (props?.onBeforeMount) {
          if (config.collectMounts) {
            if (!context.mounts) {
              context.mounts = []
            }

            context.mounts.push(props.onBeforeMount)

            return callback()
          } else {
            return props.onBeforeMount().then(callback)
          }
        }

        return callback()
      } else {
        if (typeof subject[0][0] === 'string') {
          return renderToString(subject, context, config)
        } else {
          return (
            subject.map(item => {
              console.log(item)
              return renderToString(item, context, config)
            })
          ).join('')
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

      result += childToString(child)

      childrenCount++
    } else {
      result += chunk
    }
  }

  return result
}
