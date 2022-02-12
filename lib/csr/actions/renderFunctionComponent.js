import { makeContext } from '../../utils/utils.js'
import renderSubject from './renderSubject.js'

export default function renderFunctionComponent(subject, parent, context, index) {
  makeContext(subject[1], context)
  
  let callback = () => {
    return renderSubject(subject[0](subject[1], context), parent, context,
      index)
  }
  
  if (subject[1].beforeMount) {
    return subject[1].beforeMount().then(callback)
  }
  
  return callback()
}
