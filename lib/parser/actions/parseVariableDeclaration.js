function parseVariableDeclaration(exp) {
  if (exp.kind === 'var') {
    const span = exp.span

    exp.declarations.forEach((exp) => {
      if (exp.init.type === 'ObjectExpression') {
        exp.init = {
          span,
          type: 'CallExpression',
          callee: {
            span,
            type: 'MemberExpression',
            object: {
              span,
              type: 'Identifier',
              value: 'Var',
            },
            property: {
              span,
              type: 'Identifier',
              value: 'observable',
            },
          },
          arguments: [
            {
              expression: exp.init,
            },
            {
              expression: {
                type: 'StringLiteral',
                span,
                value: exp.id.value,
              },
            },
          ],
        }
        return exp
      }

      if (exp.init.type === 'JSXElement') {
        return this.visitJSXElement.call(this, exp.init)
      }
    })
  }
}

export default parseVariableDeclaration
