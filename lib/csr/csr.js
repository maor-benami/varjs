import { isFunction } from '../utils/is.js'
import renderSubject from './actions/renderSubject.js'

export default function csr (subject, parent = document.body, context = {})  {
  if (isFunction(subject)) {
    return renderSubject(subject(parent.ownerDocument.defaultView), parent, context)
  } else {
    return renderSubject(subject, parent, context)
  }
}
