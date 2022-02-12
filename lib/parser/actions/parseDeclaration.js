import parseJSXElement from './parseJSXElement.js'

function parseArgument (declaration, src) {
  if (!declaration) return
  if (declaration.type === 'JSXElement') {
    parseJSXElement(declaration, src)
  }
  
  if (declaration.type === 'BlockStatement') {
    parseDeclarationBody(declaration, src)
  }
  
  if (declaration.type === 'ArrowFunctionExpression') {
    parseDeclarationBody(declaration, src)
  }
}

export function parseDeclarationBody (body, src) {
  function parseBodyStatement (statement) {
    if (statement.type === 'ReturnStatement') {
      parseArgument(statement.argument, src)
    } else {
      parseDeclaration(statement, src)
    }
  }
  
  if (!body.body) return
  if (Array.isArray(body.body)) {
    body.body.forEach(parseBodyStatement)
  } else {
    parseArgument(body.body, src)
  }
}

export default function parseDeclaration (declaration, src) {
  function parseVariableDeclaration (declaration) {
    if (declaration.kind === 'var') {
      declaration.declarations = declaration.declarations.map(declaration => {
        declaration.init = {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: 'Var',
            },
            property: {
              type: 'Identifier',
              name: 'observable',
            },
          },
          arguments: [
            declaration.init,
            {
              type: 'Literal',
              value: declaration.id.name
            }
          ],
          
        }
        return declaration
      })
    }
    
    declaration.declarations.forEach(declarator => {
      if (!declarator.init) return
      
      if (declarator.init.type === 'ArrowFunctionExpression') {
        parseDeclarationBody(declarator.init ,src)
      }
      
      if (declarator.init.type === 'JSXElement') {
        parseJSXElement(declarator.init, src)
      }
    })
  }
  
  function parseFunctionDeclaration (declaration) {
    if (!declaration.body) return
    parseDeclarationBody(declaration.body, src)
  }
  
  if (declaration.type === 'ExportDefaultDeclaration') {
    parseDeclaration(declaration.declaration, src)
  }
  
  if (declaration.type === 'ExportNamedDeclaration') {
    parseDeclaration(declaration.declaration, src)
  }
  
  if (declaration.type === 'VariableDeclaration') {
    parseVariableDeclaration(...arguments)
  }
  
  if (declaration.type === 'FunctionDeclaration' || declaration.type ===
    'ArrowFunctionExpression') {
    parseFunctionDeclaration(...arguments)
  }
  
  if (declaration.type === 'ExpressionStatement') {
    if (declaration.expression.arguments) {
      declaration.expression.arguments.forEach((argument) => {
        parseArgument(argument, src)
      })
    }
  }
  
  if (declaration.type === 'IfStatement') {
    if (declaration.consequent) {
      parseDeclarationBody(declaration.consequent, src)
    }
    
    if (declaration.alternate) {
      parseDeclarationBody(declaration.alternate, src)
    }
  }
}
