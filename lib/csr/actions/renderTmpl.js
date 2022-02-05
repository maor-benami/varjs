function createElements (html, document) {
  let template = document.createElement('template')
  template.innerHTML = html
  return template.content.childNodes
}

function createTmpl (tmpl) {
  let result = ''
  
  for (let chunk of tmpl) {
    result += chunk
  }
  
  return result
}

export default function renderTmpl (tmpl, parent) {
  let document = parent.ownerDocument
  let template = createTmpl(tmpl)
  let elements = createElements(template, document)
  let domElements = Array.from(elements)
  
  domElements.forEach(domElement => {
    parent.append(domElement)
  })
  
  return parent
}