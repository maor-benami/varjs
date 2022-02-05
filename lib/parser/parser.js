import { parseScript } from 'meriyah'
import { generate } from 'astring'
import parseDeclaration from './actions/parseDeclaration.js'

let SRC = ''

export default function parser (input) {
  SRC = input
  
  let parsed = parseScript(input, {
    module: true,
    jsx: true,
    ranges: true,
  })
  
  parsed.body.forEach(dec => {
    parseDeclaration(dec, SRC)
  })
  
  return generate(parsed)
}
