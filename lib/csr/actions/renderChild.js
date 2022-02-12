import { select } from '../../utils/utils.js'
import { isComponent, isFunction, isText } from '../../utils/is.js'
import { observe } from '../oberverable.js'
import renderSubject from './renderSubject.js'
import renderText from './renderText.js'
import renderList from './renderList.js'
import removeChild  from './removeChild.js'

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
        }
        
        let comment = document.createComment(String(index))
        let next = target.childNodes[index]
        target.insertBefore(comment, next)
        
        if (!target.slots[index]) {
          target.slots[index] = true
        }
      } else if (isText(result)) {
        let targetSelector = [childIndex, ...selector.slice(1)]
        let textTarget = select(targetSelector, parent, true)
        
        if (textTarget) {
          if (textTarget.nodeType === 8) {
            removeChild(textTarget)
            renderText(result, target, context, index)
          } else {
            textTarget.nodeValue = String(result)
          }
        } else {
          renderText(result, target, context, index)
        }
      } else {
        if (isComponent(result)) {
          renderSubject(result, target, context, index)
        } else {
          if (target) {
            renderList(result, target, context)
          } else {
            console.log(77)
          }
        }
      }
    }, target)
  } else {
    renderSubject(value, target, context, index)
  }
}
