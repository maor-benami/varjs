const NULL = {
  type: 'Literal',
  value: null
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
  wbr: 1
};

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

function createJsxObject (jsxElement) {
  let tag = jsxElement.openingElement && jsxElement.openingElement.name.name
  let isComponent = tag && tag.charAt(0) === tag.charAt(0).toUpperCase()
  
  if (isComponent) {
    jsxElement.type = 'CallExpression'
    jsxElement.callee = {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: NAME
      },
      property: {
        type: 'Identifier',
        name: FC
      }
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
  
  function parseElement (element) {
    if (element.openingElement) {
      let tag = element.openingElement && element.openingElement.name.name
      
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
        templateElements.push({
          type: 'Literal',
          value: `>`,
        })
  
        templateElements.push({
          type: 'Literal',
          value: `</${tag}>`,
        })
      }
    }
    
    return element
  }
  
  parseElement(jsxElement)
  
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
