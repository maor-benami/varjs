import { f, fc } from '../utils/utils.js'
import { observable } from './oberverable.js'
import renderComponent from './actions/renderComponent.js'

window.Var = {
  fc,
  observable
}

export default function csr (subject, parent = document.body) {
  let context = {}
  
  return renderComponent(f(subject), parent, context)
}