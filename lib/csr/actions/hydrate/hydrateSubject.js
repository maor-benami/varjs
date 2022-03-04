import { isComponent, isFunction, isText } from '../../../shared/is.js'
import hydrateFunctionComponent from './hydrateFunctionComponent.js'
import hydrateComponent from './hydrateComponent.js'
import observeSubject from '../observeSubject.js'

export default function hydrateSubject (subject, parent, context, index = 0) {
  if (!subject) {
  } else if (isText(subject)) {
  } else if (isFunction(subject)) {
    console.log(subject)
    // observeSubject(subject, parent, context, index)
  } else if (isFunction(subject[0])) {
    hydrateFunctionComponent(subject, parent, context, index)
  } else if (isComponent(subject)) {
    hydrateComponent(subject, parent, context, index)
  } else {
    subject.forEach(item => {
      hydrateSubject(item, parent, context, index)
    })
  }
}
