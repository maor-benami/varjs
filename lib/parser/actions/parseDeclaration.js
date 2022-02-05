import parseJSXElement from './parseJSXElement.js'

let SRC = ''

function parseVariableDeclaration (declaration) {
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

function parseDeclarationBody (body) {
  if (!body.body) return
  if (Array.isArray(body.body)) {
    body.body.forEach(parseBodyStatement)
  } else {
    parseArgument(body.body)
  }
}

function parseArgument (declaration) {
  if (declaration.type === 'JSXElement') {
    parseJSXElement(declaration, SRC)
  }
  
  if (declaration.type === 'BlockStatement') {
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
}