import select, { isFunction, isText } from '../../utils/utils.js'
import renderComponent from './renderComponent.js'
import { observe } from '../oberverable.js'

function removeChild (child) {
  if (child) {
    if (child._subs) {
      child._subs.forEach(sub => sub())
    }
    
    child.remove()
  }
}

export default function renderChild (child, parent, context, childIndex) {
  let [value, selector] = child
  let target = select([childIndex, ...selector.slice(1, -1)], parent)
  let index = selector.at(-1)
  
  if (isFunction(value)) {
    observe(() => {
      let result = value()
      
      if (result === false) {
        let childTarget = target.childNodes[index]
        
        if (!target.slots) {
          target.slots = {}
        }
        
        if (target.slots[index]) {
          removeChild(childTarget)
        } else {
          let comment = document.createComment(String(index))
          target.insertBefore(comment, target.childNodes[index])
        }
  
        if (!target.slots[index]) {
          target.slots[index] = true
        }
        
      } else if (isText(result)) {
        let textTarget = select([childIndex, ...selector.slice(1)], parent)
        
        if (textTarget) {
          textTarget.nodeValue = String(result)
        } else {
          let text = document.createTextNode(String(result))
          target.append(text)
        }
      } else {
        renderComponent(result, target, context, index)
      }
    }, target)
  } else {
    renderComponent(value, target, context, index)
  }
}