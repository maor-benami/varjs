import { f } from '../../shared/utils.js'
import { isFunction, isText } from '../../shared/is.js'
import renderToChunks from './renderToChunks.js'
import renderSpreadProps from './renderSpreadProps.js'

export default async function renderAsyncToString(subject, context, config) {
  let chunks = renderToChunks(f(subject), context, config)

  let result = ''

  if (context.mounts) {
    await Promise.all(context.mounts.map((eff) => eff()))
  }

  chunks.forEach((chunk) => {
    if (isFunction(chunk)) {
      if (isFunction(chunk)) {
        let res = chunk()

        if (isText(res)) {
          result += chunk
        } else {
          result += renderSpreadProps(res)
        }
      } else {
        result += chunk
      }
    } else {
      result += chunk
    }
  })

  return result
}
