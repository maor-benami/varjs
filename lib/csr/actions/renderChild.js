import { getKey, select, } from '../../utils/utils.js'
import { isComponent, isFunction, isText, } from '../../utils/is.js'
import { observe } from '../oberverable.js'
import renderSubject from './renderSubject.js'
import renderText from './renderText.js'

export function removeChild (child) {
  if (child) {
    if (child._subs) {
      child._subs.forEach(sub => sub())
    }
    
    child.remove()
  }
}

function renderList (value, parent, context) {
  let removeKeys = { ...parent.keys }
  
  let move = []
  
  value.forEach((item, index) => {
    let key = getKey(item)
    
    if (!parent.keys) {
      parent.keys = {}
    }
    
    if (parent.keys[key] == null) {
      parent.keys[key] = index
      renderSubject(item, parent, context, index)
    } else {
      delete removeKeys[key]
      
      let current = parent.querySelector(`:scope > [key="${key}"]`)
      let nextValue = value[index + 1]
      
      if (nextValue) {
        let nextKey = getKey(nextValue)
        let next = parent.querySelector(`:scope > [key="${nextKey}"]`)
        
        if (index !== parent.keys[key]) {
          move.unshift(() => {
            if (next) {
              parent.insertBefore(current, next)
            } else {
              parent.append(current)
            }
            parent.keys[key] = index
          })
        }
      } else {
        move.unshift(() => {
          parent.append(current)
          parent.keys[key] = index
        })
      }
    }
  })
  
  move.forEach(eff => eff())
  
  Object.keys(removeKeys).forEach(key => {
    removeChild(parent.querySelector(`:scope > [key="${key}"]`))
    delete parent.keys[key]
  })
  
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
        console.log(targetSelector, parent)
        console.log(textTarget)
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
          }
        }
      }
    }, target)
  } else {
    renderSubject(value, target, context, index)
  }
}
