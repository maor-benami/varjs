const CONSTRUCTOR = 'constructor'

export function select (selector, parent, ignoreComments) {
  return selector.reduce((element, index) => {
    if (!element) return
    let children = element.childNodes
    return children[index]
  }, parent)
}

export let f = (f) => f && (f.call ? f() : f)
export let typeOf = (obj, type) => typeof obj === type
export let isFunction = (obj) => obj && obj.constructor.name === 'Function'
export let isObject = (value) => typeOf(value, 'object')
export let isText = (value) => {
  return typeOf(value, 'string') || typeOf(value, 'number')
}
export let isArray = (value) => Array.isArray(value)
export let isProxy = (obj) => obj !== null && (isArray(obj) || isObject(obj))
export let isSymbol = (obj) => typeOf(obj, 'symbol')
export let isMap = (x) => x && x[CONSTRUCTOR].name === 'Map'
export let isSet = (x) => x && x[CONSTRUCTOR].name === 'Set'
export let fc = (...args) => args

export let getChildren = (parent) => Array.from(parent.childNodes)

export function getKey (item) {
  let result = item[2]?.find(item => item[0] === 'key')
  return result && f(result[1])
}

export function makeProps (props, context) {
  if (props?.context) {
    Object.keys(props.context).forEach(key => {
      context[key] = props.context[key]
    })
  }
}
