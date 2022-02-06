import renderComponent from './actions/renderComponent.js'
import { fc, isFunction } from '../utils/utils.js'
import { observable } from './oberverable.js'

window.Var = {
  fc,
  observable
}

export default function csr (subject, parent = document.body) {
  if (isFunction(subject)) {
    return csr(subject(), parent)
  }
  
  let context = {}
  
  return renderComponent(subject, parent, context)
}