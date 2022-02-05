import { parseScript } from 'meriyah'
import { generate } from 'astring'
import parseDeclaration from './actions/parseDeclaration.js'

export default function parser (input) {
  let parsed = parseScript(input, {
    module: true,
    jsx: true,
    ranges: true,
  })
  
  parsed.body.forEach(declaration => {
    parseDeclaration(declaration, input)
  })
  
  return generate(parsed)
}
