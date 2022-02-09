import { f, getKey, isFunction, isText, select } from '../../utils/utils.js'
import renderComponent from './renderComponent.js'
import { observe } from '../oberverable.js'

export function removeChild (child) {
  if (child) {
    if (child._subs) {
      child._subs.forEach(sub => sub())
    }
    
    child.remove()
  }
}

function renderList (value, parent, context) {
  let tempKeys = { ...parent.keys }
  
  let move = []

  value.forEach((item, index) => {
    let key = getKey(item)

    if (!parent.keys) {
      parent.keys = {}
    }
    
    if (parent.keys[key] == null) {
      parent.keys[key] = index
      renderComponent(item, parent, context, index)
    } else {
      delete tempKeys[key]
      
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
        //
      } else {
        parent.append(current)
        parent.keys[key] = index
      }
      // console.log(parent.keys)
    }
  })
  
  move.forEach(eff => eff())
  
  Object.keys(tempKeys).forEach(key => {
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
        let textTarget = select([childIndex, ...selector.slice(1)], parent,
          true)
        if (textTarget) {
          textTarget.nodeValue = String(result)
        } else {
          let text = document.createTextNode(String(result))
          target.append(text)
        }
      } else {
        if (typeof result[0][0] === 'string') {
          return renderComponent(result, target, context, index)
        } else {
          if (target) {
            renderList(result, target, context)
          } else {
            // console.log(target)
            // console.log(parent, selector, childIndex)
            // console.log(select([childIndex, ...selector.slice(1, -1)], parent))
          }
        }
      }
    }, target)
  } else {
    renderComponent(value, target, context, index)
  }
}
