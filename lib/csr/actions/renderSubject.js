import { isComponent, isFunction, isText } from '../../utils/is.js'
import renderText from './renderText.js'
import renderFunctionComponent from './renderFunctionComponent.js'
import renderComponent from './renderComponent.js'
import observeSubject from './observeSubject.js'

export default function renderSubject (subject, parent, context, index = 0) {
  if (!subject) {
  } else if (isText(subject)) {
    renderText(subject, parent, context, index)
  } else if (isFunction(subject)) {
    observeSubject(subject, parent, context, index)
  } else if (isFunction(subject[0])) {
    renderFunctionComponent(subject, parent, context, index)
  } else if (isComponent(subject)) {
    renderComponent(subject, parent, context, index)
  } else {
    subject.forEach(item => {
      renderSubject(item, parent, context, index)
    })
  }
}
