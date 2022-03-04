import { f } from './utils.js'

const extractProps = (props) => {
  let attributes = []
  let events = []
  let attributeCount = 0

  Object.keys(props).forEach(prop => {
    let isEvent = prop.startsWith('on')

    if (isEvent) {
      events.push([prop.substr(2).toLowerCase(), props[prop], [0]])
    } else {
      if (prop !== 'children' && prop !== 'props') {
        attributes.push([prop, props[prop], [attributeCount]])
        attributeCount++
      }
    }
  })

  return [attributes, events]
}

const styleObjToString = (styleObj) => {
  let result = ''

  Object.keys(styleObj).forEach(key => {
    result += `${key}: ${f(styleObj[key])};`
  })

  return result
}

export default new Proxy({}, {
  get: (target, p) => {
    return (styleFunc) => {
      return (props) => {
        let children = [[props.children, [0]]]
        let [attributes, events] = extractProps(props)

        let style = () => styleObjToString(styleFunc(f(props.props)))
        let tmpl = [`<${p}`, ...attributes.map(() => ' '), ' ', '>', '', `</${p}>`]

        attributes.push(['style', style, [0]])

        return [
          tmpl,
          children,
          attributes,
          events
        ]

      }
    }
  },
})
