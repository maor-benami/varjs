export function select (selector, parent, ignoreComments) {
  return selector.reduce((element, index) => {
    if (!element) return
    let children = element.childNodes
    return children[index]
  }, parent)
}

export let f = (f) => f && (f.call ? f() : f)

export function fc (...args) {
  return args
}

export function getChildren (parent) {
  return Array.from(parent.childNodes)
}

export function getKey (item) {
  let result = item[2]?.find(item => item[0] === 'key')
  return result && f(result[1])
}

export function makeContext (props, context) {
  if (!context.mounts) {
    context.mounts = []
  }
  
  if (props?.context) {
    Object.keys(props.context).forEach(key => {
      context[key] = props.context[key]
    })
  }
}