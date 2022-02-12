const CONSTRUCTOR = 'constructor'

export let typeOf = (obj, type) => typeof obj === type

export let isComponent = (subject) => subject && subject[0] &&
  isArray(subject[0]) && isText(subject[0][0])
export let isFunction = (obj) => obj && typeOf(obj, 'function')
export let isObject = (value) => typeOf(value, 'object')
export let isString = (value) => typeOf(value, 'string')
export let isNumber = (value) => typeOf(value, 'number')
export let isText = (value) => isString(value) || isNumber(value)
export let isArray = (value) => Array.isArray(value)
export let isProxy = (obj) => obj !== null && (isArray(obj) || isObject(obj))
export let isSymbol = (obj) => typeOf(obj, 'symbol')
export let isMap = (x) => x && x[CONSTRUCTOR].name === 'Map'
export let isSet = (x) => x && x[CONSTRUCTOR].name === 'Set'