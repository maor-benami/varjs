import { makeContext } from '../../../shared/utils.js'
import hydrateSubject from './hydrateSubject.js'

export default function hydrateFunctionComponent(subject, parent, context, index) {
  makeContext(subject[1], context)
  
  let callback = () => {
    hydrateSubject(subject[0](subject[1], context), parent, context,
      index)
  }
  
  return callback()
}
