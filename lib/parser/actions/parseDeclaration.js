import parseJSXElement from './parseJSXElement.js'

let SRC = ''

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
        ],
        
      }
      return declaration
    })
  }
  
  declaration.declarations.forEach(declarator => {
    if (!declarator.init) return
   
    if (declarator.init.type === 'ArrowFunctionExpression') {
      parseDeclarationBody(declarator.init)
    }
    
    if (declarator.init.type === 'JSXElement') {
      parseJSXElement(declarator.init, SRC)
    }
  })
}

function parseBodyStatement (statement) {
  if (statement.type === 'ReturnStatement') {
    parseArgument(statement.argument)
  } else {
    parseDeclaration(statement)
  }
}

export function parseDeclarationBody (body) {
  if (!body.body) return
  if (Array.isArray(body.body)) {
    body.body.forEach(parseBodyStatement)
  } else {
    parseArgument(body.body)
  }
}

function parseArgument (declaration) {
  if (!declaration) return
  if (declaration.type === 'JSXElement') {
    parseJSXElement(declaration, SRC)
  }
  
  if (declaration.type === 'BlockStatement') {
    parseDeclarationBody(declaration)
  }
  
  if (declaration.type === 'ArrowFunctionExpression') {
    parseDeclarationBody(declaration)
  }
}

function parseFunctionDeclaration (declaration) {
  if (!declaration.body) return
  parseDeclarationBody(declaration.body)
}

export default function parseDeclaration (declaration, src) {
  if (src && !SRC) {
    SRC = src
  }

  if (declaration.type === 'ExportDefaultDeclaration') {
    parseDeclaration(declaration.declaration)
  }
  
  if (declaration.type === 'ExportNamedDeclaration') {
    parseDeclaration(declaration.declaration)
  }
  
  if (declaration.type === 'VariableDeclaration') {
    parseVariableDeclaration(...arguments)
  }
  
  if (declaration.type === 'FunctionDeclaration') {
    parseFunctionDeclaration(...arguments)
  }
  
  if (declaration.type === 'ExpressionStatement') {
    if (declaration.expression.arguments) {
      declaration.expression.arguments.forEach(parseArgument)
    }
  }

  if (declaration.type === 'IfStatement') {
    if (declaration.consequent) {
      parseDeclarationBody(declaration.consequent)
    }

    if (declaration.alternate) {
      parseDeclarationBody(declaration.alternate)
    }
  }
}
