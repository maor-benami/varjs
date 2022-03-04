export let f = (f) => f && (f.call ? f() : f)

export function select (selector, parent) {
  return selector.reduce((element, index) => {
    if (!element) return
    let children = element.tagName ? element.childNodes : element.children
    return children[index]
  }, parent)
}

export function getKey (item) {
  let result = item[2]?.find(item => item[0] === 'key')
  return result && f(result[1])
}

export function querySelector (parent, key) {
  return parent.querySelector(`[key="${key}"]`)
}

export function isCommentNode (node) {
  return node && node.nodeType === 8
}
