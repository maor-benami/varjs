import { transformSync } from '@swc/core'
import { Visitor } from '@swc/core/Visitor.js'

import parseVariableDeclaration from './actions/parseVariableDeclaration.js'
import parseJSXElement from './actions/parseJSXElement2.js'

let INPUT

class VarJSPlugin extends Visitor {
  /*visitVariableDeclaration(exp) {
    parseVariableDeclaration.call(this, exp)
    return exp
  }*/

  visitJSXElement(exp) {
    parseJSXElement.call(this, exp, INPUT)
    return exp
  }

  visitArrayExpression(exp) {
    console.log(exp)
    return exp
  }
}

function parser(input) {
  INPUT = input
  return transformSync(input, {
    jsc: {
      target: 'es2022',
      parser: {
        jsx: true,
      },
    },
    plugin: (m) => new VarJSPlugin().visitProgram(m),
  })
}

console.log(
  parser(
    `function App() { return <div style={"color: red"}><span>{1}{'2'}</span></div> }

render(<App {...props} />)`,
  ),
)

export default parser
