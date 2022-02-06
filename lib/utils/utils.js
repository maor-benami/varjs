const CONSTRUCTOR = 'constructor'

export default function select (selector, parent) {
  return selector.reduce((element, index) => {
    if (!element) return
    let children = element.childNodes
    let selected = children[index]
    return selected
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
