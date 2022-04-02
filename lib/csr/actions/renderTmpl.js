import { isFunction } from '../../shared/is.js'

function createElements(html, document) {
  let template = document.createElement('template')
  template.innerHTML = html
  return template.content.childNodes
}

export function createTmpl(tmpl) {
  let result = ''
  let childrenCount = 0
  let props = () => {}

  for (let i = 0; i < tmpl.length; i++) {
    let chunk = tmpl[i]
    let nextChunk = tmpl[i + 1]

    if (isFunction(chunk)) {
      props = chunk
    } else {
      if (chunk === '') {
        childrenCount++
      }

      result += chunk
    }

    if (nextChunk === '' && !tmpl[i + 2].startsWith('</')) {
      result += `<!--#-->`
    }
  }

  return [result, props()]
}

export default function renderTmpl(tmpl, parent, context, childIndex) {
  let document = parent.ownerDocument || parent
  let [template, props] = createTmpl(tmpl)
  let domElements = createElements(template, document)

  if (domElements.length === 1) {
    const domElement = domElements[0]
    if (childIndex) {
      parent.insertBefore(domElement, parent.childNodes[childIndex])
    } else {
      parent.prepend(domElement)
    }

    return [domElement, props]
  }
}
