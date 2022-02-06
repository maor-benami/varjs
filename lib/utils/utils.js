const CONSTRUCTOR = 'constructor'

export function select (selector, parent, ignoreComments) {
  return selector.reduce((element, index) => {
    if (!element) return
    let children = element.childNodes
    return children[index]
  }, parent)
}

export let f = (f) => f && (f.call ? f() : f);
export let typeOf = (obj, type) => typeof obj === type;
export let isAsyncFunction = (obj) => obj.constructor.name === 'AsyncFunction';
export let isFunction = (obj) => obj.constructor.name === 'Function';
export let isObject = (value) => typeOf(value, 'object');
export let isComponent = (value) => isArray(value[0]) && isText(value[0][0]);
export let isText = (value) => {
  return typeOf(value, 'string') || typeOf(value, 'number');
};
export let isTextNode = (node) => {
  return node && node.nodeType === 3;
};
export let isArray = (value) => Array.isArray(value);
export let isProxy = (obj) => obj !== null && (isArray(obj) || isObject(obj));
export let isSymbol = (obj) => typeOf(obj, 'symbol');
export let isMap = (x) => x && x[CONSTRUCTOR].name === 'Map';
export let isSet = (x) => x && x[CONSTRUCTOR].name === 'Set';
export let fc = (...args) => args

export let getChildren = (parent) => Array.from(parent.childNodes);

export function getKey(item) {
  let result = item[2].find(item => item[0] === 'key')
  return result && result[1]
}

export function makeProps (props, context) {
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