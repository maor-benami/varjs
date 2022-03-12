function createElements (html, document) {
  let template = document.createElement('template')
  template.innerHTML = html
  return template.content.childNodes
}

export function createTmpl (tmpl) {
  let result = ''
  let childrenCount = 0
  
  for (let i = 0; i < tmpl.length; i++) {
    let chunk = tmpl[i]
    let nextChunk = tmpl[i + 1]

    if (chunk === '') {
      childrenCount++
    }
    
    result += chunk

    if (nextChunk === '' && !tmpl[i + 2].startsWith('</')) {
      result += `<!--#-->`
    }
  }
  
  return result
}

export default function renderTmpl (tmpl, parent, context, childIndex) {
  let document = parent.ownerDocument || parent
  let template = createTmpl(tmpl)
  let domElements = createElements(template, document)

  Array.from(domElements).forEach(domElement => {
    if (childIndex) {
      parent.insertBefore(domElement, parent.childNodes[childIndex])
    } else {
      parent.prepend(domElement)
    }
  })
  
  return parent
}
