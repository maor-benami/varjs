import { getKey, querySelector } from '../utils.js'
import { observe } from '../oberverable.js'
import renderSubject from './renderSubject.js'
import removeChild  from './removeChild.js'
import { isText } from '../../shared/is.js'
import renderText from './renderText.js'

export default function observeSubject (subject, parent, context, index) {
  observe(() => {
    let value = subject()

    if (isText(value)) {
      return renderText(value, parent, context, index)
    }

    if (!parent?.slots) {
      parent.slots = {}
    }
    
    if (!value) {
      let childTarget = parent.childNodes[index]
      
      if (parent.slots[index]) {
        removeChild(childTarget)
      }
      
      let comment = document.createComment(String(index))
      let next = parent.childNodes[index]
      parent.insertBefore(comment, next)
    } else {
      let key = getKey(value)
      let exists = querySelector(parent, key)
      if (!exists) {
        let childTarget = parent.childNodes[index]
        
        if (childTarget?.nodeType === 8) {
          removeChild(childTarget)
        }
        renderSubject(value, parent, context, index)
      }
    }
    
    if (!parent.slots[index]) {
      parent.slots[index] = true
    }
  }, parent)
}
