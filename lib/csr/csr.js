import renderTmpl from './actions/renderTmpl.js'

export default function csr(subject, parent = document.body) {
  let [tmpl] = subject
  
  renderTmpl(tmpl, parent)
  
  return parent
}