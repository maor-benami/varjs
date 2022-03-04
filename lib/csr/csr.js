import { isFunction } from '../shared/is.js'
import renderSubject from './actions/renderSubject.js'

export default function csr (subject, parent = document.body, context = {})  {
  if (isFunction(subject)) {
    return renderSubject(subject(), parent, context)
  } else {
    return renderSubject(subject, parent, context)
  }
}
