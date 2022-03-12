import { isComponent, isFunction, isText } from '../../../shared/is.js'
import { observe } from '../../oberverable.js'
import hydrateFunctionComponent from './hydrateFunctionComponent.js'
import hydrateComponent from './hydrateComponent.js'
import renderText from '../renderText.js'
import toggleSubject from '../toggleSubject.js'
import renderSubject from '../renderSubject.js'
import renderList from '../renderList.js'

export default function hydrateSubject (subject, parent, context, index = 0) {
  if (!subject) {
    toggleSubject(subject, parent, context, index)
  } else if (isText(subject)) {
    renderText(subject, parent, context, index)
  } else if (isFunction(subject)) {
    // observe(() => renderSubject(subject(), parent.parentNode, context, index), parent)
  } else if (isFunction(subject[0])) {
    hydrateFunctionComponent(subject, parent, context, index)
  } else if (isComponent(subject)) {
    hydrateComponent(subject, parent, context, index)
  } else {
    renderList(subject, parent, context, index)
  }
}
