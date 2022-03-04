import { getKey, querySelector } from '../utils.js'
import { observe } from '../oberverable.js'
import renderSubject from './renderSubject.js'
import removeChild  from './removeChild.js'

export default function observeSubject (subject, parent, context, index) {
  observe(() => {
    let result = subject()
    let target = parent
    
    if (!target?.slots) {
      target.slots = {}
    }
    
    if (!result) {
      let childTarget = target.childNodes[index]
      
      if (target.slots[index]) {
        removeChild(childTarget)
      }
      
      let comment = document.createComment(String(index))
      let next = target.childNodes[index]
      target.insertBefore(comment, next)
    } else {
      let key = getKey(result)
      let exists = querySelector(parent, key)
      if (!exists) {
        let childTarget = target.childNodes[index]
        
        if (childTarget?.nodeType === 8) {
          removeChild(childTarget)
        }
        renderSubject(result, parent, context, index)
      }
    }
    
    if (!target.slots[index]) {
      target.slots[index] = true
    }
  }, parent)
}
