import { parseDeclarationBody } from './parseDeclaration.js'

const NULL = {
  type: 'Literal',
  value: null,
}

const NAME = 'Var'
const FC = 'fc'

let SRC = ''
let isFunction = (node) => {
  return (
    node?.type === 'FunctionDeclaration' ||
    node?.type === 'ArrowFunctionExpression' ||
    node?.type === 'AsyncFunctionExpression' ||
    node?.type === 'AsyncArrowFunctionExpression'
  )
}
let isFunctionOrObject = (node) => node.type === 'ObjectExpression' ||
  isFunction(node)

const selfClosingTags = {
  area: 1,
  base: 1,
  br: 1,
  col: 1,
  embed: 1,
  hr: 1,
  img: 1,
  input: 1,
  link: 1,
  meta: 1,
  param: 1,
  source: 1,
  track: 1,
  wbr: 1,
}

function createSelector (selector, idx) {
  let newSelector = {
    type: 'ArrayExpression',
    elements: [],
  }
  
  newSelector.elements = [...selector.elements.map(el => el)]
  
  newSelector.elements.push({
    type: 'Literal',
    value: idx,
  })
  
  return newSelector
}

function createExpressionValue (value, functionize) {
  if (value.type === 'JSXExpressionContainer') {
    let avoid = SRC.charAt(value.expression.start - 1) === '(' &&
      SRC.charAt(value.expression.end) === ')'
    
    return functionize && !avoid && !isFunctionOrObject(value.expression) ? {
      type: 'ArrowFunctionExpression',
      params: [],
      body: value.expression,
    } : value.expression
  } else {
    return value
  }
  
}

function createComponentPropsObject (jsxElement) {
  let propertiesElements = []
  let childrenElements = []
  
  jsxElement.children.forEach(child => {
    if (child.type === 'JSXText') {
      let trimmed = child.value.trim()
      if (trimmed) {
        childrenElements.push({
          type: 'Literal',
          value: child.value,
        })
      }
      
    } else if (child.type === 'JSXExpressionContainer') {
      parseExp(child.expression)
      
      childrenElements.push(child.expression)
    } else if (child.type === 'JSXElement') {
      childrenElements.push(parseJSXElement(child))
    }
  })
  
  propertiesElements.push({
    type: 'Property',
    key: {
      type: 'Literal',
      value: 'children',
    },
    value: {
      type: 'ArrayExpression',
      elements: childrenElements,
    },
    kind: 'init',
  })
  
  if (jsxElement?.openingElement.attributes) {
    jsxElement.openingElement.attributes.forEach(attribute => {
      propertiesElements.push({
        type: 'Property',
        key: {
          type: 'Literal',
          value: attribute.name.name,
        },
        value: createExpressionValue(attribute.value),
        kind: 'init',
      })
    })
  }
  
  return {
    type: 'ObjectExpression',
    properties: propertiesElements,
  }
}

function parseExp (expression) {
  if (expression.type === 'LogicalExpression') {
    if (expression.right.type === 'JSXElement') {
      expression.right = parseJSXElement(expression.right)
    }
  }
  if (expression.type === 'ConditionalExpression') {
    if (expression.consequent.type === 'JSXElement') {
      expression.consequent = parseJSXElement(
        expression.consequent)
    }
    if (expression.alternate.type === 'JSXElement') {
      expression.alternate = parseJSXElement(
        expression.alternate)
    }
  }
  if (expression.type === 'ArrowFunctionExpression') {
    parseExp(expression.body)
  }
  
  if (expression.type === 'CallExpression') {
    if (expression.arguments) {
      expression.arguments.map(argument => {
        if (argument.body) {
          parseDeclarationBody(argument.body)
        }
        return argument
      })
    }
  }
}

function createJsxObject (jsxElement) {
  let tag = jsxElement.openingElement && jsxElement.openingElement.name.name
  let isComponent = tag && tag.charAt(0) === tag.charAt(0).toUpperCase()
  
  if (isComponent) {
    jsxElement.type = 'CallExpression'
    jsxElement.callee = {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: NAME,
      },
      property: {
        type: 'Identifier',
        name: FC,
      },
    }
    jsxElement.arguments = [
      {
        type: 'Identifier',
        name: tag,
      },
      createComponentPropsObject(jsxElement),
    ]
    return
  }
  
  let templateElements = []
  let childrenElements = []
  let attributesElements = []
  let eventsElements = []
  let childrenLength = 0
  
  function parseAttributes (element, selector) {
    element.openingElement.attributes?.forEach(attribute => {
      if (attribute.value.type === 'Literal') {
        templateElements.push({
          type: 'Literal',
          value: ` ${attribute.name.name}="${attribute.value.value}"`,
        })
      } else {
        if (attribute.name.name.startsWith('on')) {
          eventsElements.push({
            type: 'ArrayExpression',
            elements: [
              {
                type: 'Literal',
                value: attribute.name.name.substr(2).toLowerCase(),
              },
              createExpressionValue(attribute.value),
              selector,
            ],
          })
        } else {
          templateElements.push({
            type: 'Literal',
            value: ' ',
          })
          
          attributesElements.push({
            type: 'ArrayExpression',
            elements: [
              {
                type: 'Literal',
                value: attribute.name.name,
              },
              createExpressionValue(attribute.value, true),
              selector,
            ],
          })
        }
      }
    })
  }
  
  function parseChildren (element, selector) {
    let idx = 0
    
    function parseChild (child) {
      if (child.type === 'JSXText') {
        let trimmed = child.value.trim()
        if (trimmed) {
          templateElements.push({
            type: 'Literal',
            value: trimmed,
          })
          
          idx++
        }
      } else {
        if (child.type === 'JSXExpressionContainer') {
          if (child.expression.type !== 'JSXEmptyExpression') {
            parseExp(child.expression)
            
            templateElements.push({
              type: 'Literal',
              value: '',
            })
            
            childrenElements.push({
              type: 'ArrayExpression',
              elements: [
                createExpressionValue(child, true),
                createSelector(selector, idx),
              ],
            })
            
            idx++
            childrenLength++
          }
        } else if (child.type === 'JSXElement') {
          parseElement(child, createSelector(selector, idx))
          
          idx++
          childrenLength++
        }
      }
    }
    
    element.children.forEach(parseChild)
  }
  
  function parseElement (element, selector) {
    if (element.openingElement) {
      let tag = element.openingElement && element.openingElement.name.name
      let isComponent = tag.charAt(0) === tag.charAt(0).toUpperCase()
      
      if (isComponent) {
        templateElements.push({
          type: 'Literal',
          value: '',
        })
        
        childrenElements.push({
          type: 'ArrayExpression',
          elements: [
            {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: NAME,
                },
                property: {
                  type: 'Identifier',
                  name: FC,
                },
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: tag,
                },
                createComponentPropsObject(element),
              ],
            },
            selector,
          ],
        })
        
        return
      }
      
      templateElements.push({
        type: 'Literal',
        value: `<${tag}`,
      })
      
      if (selfClosingTags[tag]) {
        templateElements.push({
          type: 'Literal',
          value: ` />`,
        })
      } else {
        parseAttributes(element, selector)
        
        templateElements.push({
          type: 'Literal',
          value: `>`,
        })
        
        parseChildren(element, selector)
        
        templateElements.push({
          type: 'Literal',
          value: `</${tag}>`,
        })
      }
    }
    
    return element
  }
  
  parseElement(jsxElement, {
    type: 'ArrayExpression',
    elements: [
      {
        type: 'Literal',
        value: 0,
      }],
  })
  
  let result = [
    {
      type: 'ArrayExpression',
      elements: templateElements,
    }]
  
  if (childrenElements.length) {
    result.push({
      type: 'ArrayExpression',
      elements: childrenElements,
    })
  } else {
    result.push(NULL)
  }
  
  if (attributesElements.length) {
    result.push({
      type: 'ArrayExpression',
      elements: attributesElements,
    })
  } else {
    result.push(NULL)
  }
  
  if (eventsElements.length) {
    result.push({
      type: 'ArrayExpression',
      elements: eventsElements,
    })
  } else {
    result.push(NULL)
  }
  
  return result
}

export default function parseJSXElement (jsxElement, src) {
  if (src && !SRC) {
    SRC = src
  }
  
  jsxElement.type = 'ArrayExpression'
  jsxElement.elements = createJsxObject(jsxElement, src)
  return jsxElement
}
