import { isComponent, isFunction, isText } from '../../../utils/is.js'
import { select } from '../../../utils/utils.js'
import { observe } from '../../oberverable.js'
import hydrateSubject from './hydrateSubject.js'
import renderList from '../renderList.js'
import renderSubject from '../renderSubject.js'

export function removeChild (child) {
  if (child) {
    if (child._subs) {
      child._subs.forEach(sub => sub())
    }
    
    child.remove()
  }
}

export default function hydrateChild (child, parent, context, childIndex) {
  let [value, selector] = child
  
  
  if (isFunction(value)) {
    let targetSelector = []
    if (parent.tagName !== 'HTML') {
      targetSelector.push(childIndex)
    }
    targetSelector = [...targetSelector, ...selector.slice(1)]
    let target = select(targetSelector, parent)
    let index = selector.at(-1)
    
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
        let text = String(result)
        
        if (!target) {
          targetSelector = targetSelector.slice(1)
          target = select(targetSelector, parent)
        }
        
        if (target.nodeValue !== text) {
          target.nodeValue = text
        }
      } else {
        targetSelector = selector.slice(1, -1)
        target = select(targetSelector, parent)
  
        if (isComponent(result)) {
          hydrateSubject(result, target, context, index)
        } else {
          renderList(result, target, context)
        }
      }
    }, target)
  } else {
    let targetSelector = []
    targetSelector = [...selector.slice(1)]
    let target = select(targetSelector, parent)
    let index = selector.at(-1)
    if (!target) {
      renderSubject(value, parent, context, index)
    } else {
      hydrateSubject(value, target, context, index)
    }
  
    /* if (!target) {
       targetSelector = [...targetSelector.slice(0, -1)]
       target = select(targetSelector, parent)
     }*/
    
  }
}
