import { isArray, isComponent, isFunction, isText } from '../../shared/is.js'
import { observe } from '../oberverable.js'
import renderText from './renderText.js'
import renderFunctionComponent from './renderFunctionComponent.js'
import renderComponent from './renderComponent.js'
import renderList from './renderList.js'
import toggleSubject from './toggleSubject.js'

export default function renderSubject (subject, parent, context, index = 0) {
  if (!subject) {
    toggleSubject(subject, parent, context, index)
  } else if (isText(subject)) {
    renderText(subject, parent, context, index)
  } else if (isFunction(subject)) {
    observe(() => renderSubject(subject(), parent, context, index), parent)
  } else if (isFunction(subject[0])) {
    renderFunctionComponent(subject, parent, context, index)
  } else if (isComponent(subject)) {
    renderComponent(subject, parent, context, index)
  } else if (isArray(subject)) {
    renderList(subject, parent, context, index)
  }
}
