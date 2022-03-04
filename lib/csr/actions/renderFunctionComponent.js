import { makeContext } from '../../shared/utils.js'
import renderSubject from './renderSubject.js'

export default function renderFunctionComponent (subject, parent, context, index) {
  let [func, props] = subject

  makeContext(props, context)

  function callback () {
    return renderSubject(func(props, context), parent, context, index)
  }

  if (props.beforeMount) {
    let result = props.beforeMount()

    if (result?.then) {
      return result.then(callback)
    }
  }

  return callback()
}
