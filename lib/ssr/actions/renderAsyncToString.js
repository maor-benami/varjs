import { f, isFunction } from '../../utils/utils.js'
import renderToChunks from './renderToChunks.js'

export default async function renderAsyncToString (subject, context, config) {
  let chunks = renderToChunks(f(subject), context, config)
  
  let result = ''
  
  if (context.mounts) {
    await Promise.all(context.mounts.map(eff => eff()))
  }
  
  chunks.forEach(chunk => {
    if (isFunction(chunk)) {
      result += chunk()
    } else {
      result += chunk
    }
  })
  
  return result
}
