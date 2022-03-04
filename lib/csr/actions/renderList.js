import { getKey, querySelector } from '../utils.js'
import renderSubject from './renderSubject.js'
import removeChild from './removeChild.js'

export default function renderList (value, parent, context) {
  let removeKeys = { ...parent.keys }

  let move = []

  value.forEach((item, index) => {
    let key = getKey(item)

    if (!parent.keys) {
      parent.keys = {}
    }

    let current = querySelector(parent, key)

    if (!current && parent.keys[key] == null) {
      parent.keys[key] = index
      renderSubject(item, parent, context, index)
    } else {
      delete removeKeys[key]

      let nextValue = value[index + 1]

      if (nextValue) {
        let nextKey = getKey(nextValue)
        let next = querySelector(parent, nextKey)

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
    removeChild(querySelector(parent, key))
    delete parent.keys[key]
  })
}
