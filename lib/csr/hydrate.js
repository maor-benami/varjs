import { isFunction } from '../shared/is.js'
import hydrateSubject from './actions/hydrate/hydrateSubject.js'

export default function hydrate (subject, parent = document.documentElement, context = {})  {
  let window = parent.ownerDocument.defaultView
  context = window._CONTEXT_
  if (isFunction(subject)) {
    return hydrateSubject(subject(window), parent, context)
  } else {
    return hydrateSubject(subject, parent, context)
  }
}
