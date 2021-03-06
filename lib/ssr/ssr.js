import { fc } from '../shared/utils.js'
import renderSubject from './actions/renderSubject.js'

global.Var = {
  fc,
  observable: (obj) => obj,
}

export default async function ssr(subject, context = {}, config = {}) {
  return renderSubject(subject, context, config)
}
