import { fc } from '../utils/utils.js'
import renderAsyncToString from './actions/renderAsyncToString.js'
import renderSubject from './actions/renderSubject.js'

global.Var = {
  fc,
  observable: obj => obj
}

export default async function ssr (subject, context = {}, config = {}) {
  return renderSubject(subject, context, config)
}
