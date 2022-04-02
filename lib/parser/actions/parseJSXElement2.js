import { parseDeclarationBody } from './parseDeclaration.js'
import { nullExpression, NAMESPACE, FC } from '../constants.js'

const span = { start: 0, end: 0, ctxt: 0 }

let isFunction = (node) => {
  return (
    node?.type === 'FunctionDeclaration' ||
    node?.type === 'ArrowFunctionExpression' ||
    node?.type === 'AsyncFunctionExpression' ||
    node?.type === 'AsyncArrowFunctionExpression'
  )
}
let isFunctionOrObject = (node) =>
  node.type === 'ObjectExpression' || isFunction(node)

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

function createSelector(selector, idx) {
  let newSelector = {
    type: 'ArrayExpression',
    elements: [],
    span,
  }

  newSelector.elements = [...selector.elements.map((el) => el)]

  newSelector.elements.push({
    expression: {
      type: 'NumericLiteral',
      value: idx,
      span,
    },
  })

  return newSelector
}

function parseExp(expression, src) {
  if (expression.type === 'LogicalExpression') {
    if (expression.right.type === 'JSXElement') {
      expression.right = parseJSXElement(expression.right, src)
    }
  }
  if (expression.type === 'ConditionalExpression') {
    if (expression.consequent.type === 'JSXElement') {
      expression.consequent = parseJSXElement(expression.consequent, src)
    }
    if (expression.alternate.type === 'JSXElement') {
      expression.alternate = parseJSXElement(expression.alternate, src)
    }
  }

  if (expression.type === 'ArrowFunctionExpression') {
    parseExp(expression.body, src)
  }

  if (expression.type === 'CallExpression') {
    if (expression.arguments) {
      expression.arguments.map((argument) => {
        if (argument.body) {
          parseDeclarationBody(argument.body, src)
        }
        return argument
      })
    }
  }
}

function createJsxObject(jsxElement, src) {
  let tag = jsxElement.opening && jsxElement.opening.name.name
  let isComponent = tag && tag.charAt(0) === tag.charAt(0).toUpperCase()
  let templateElements = []
  let childrenElements = []
  let attributesElements = []
  let eventsElements = []
  let childrenLength = 0
  let result = []

  if (isComponent) {
    jsxElement.type = 'CallExpression'
    jsxElement.callee = {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: NAMESPACE,
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

  function createExpressionValue(value, src) {
    if (value.type === 'JSXExpressionContainer') {
      let avoid =
        src.charAt(value.expression.span.start) === '(' &&
        src.charAt(value.expression.span.end - 1) === ')'

      if (avoid || isFunctionOrObject(value.expression)) {
        return value.expression
      }

      return {
        type: 'ArrowFunctionExpression',
        params: [],
        body: value.expression,
        span,
      }
    } else {
      return value
    }
  }

  function createComponentPropsObject(jsxElement) {
    let propertiesElements = []
    let childrenElements = []

    jsxElement.children.forEach((child) => {
      if (child.type === 'JSXText') {
        let trimmed = child.value.trim()
        if (trimmed) {
          childrenElements.push({
            type: 'StringLiteral',
            value: trimmed,
          })
        }
      } else if (child.type === 'JSXExpressionContainer') {
        parseExp(child.expression, src)

        childrenElements.push(child.expression)
      } else if (child.type === 'JSXElement') {
        childrenElements.push(parseJSXElement(child, src))
      }
    })

    if (childrenElements.length) {
      propertiesElements.push({
        type: 'KeyValueProperty',
        key: {
          type: 'StringLiteral',
          value: 'children',
        },
        value: {
          type: 'ArrayExpression',
          elements: childrenElements,
        },
        kind: 'init',
      })
    }

    if (jsxElement?.opening.attributes) {
      jsxElement.opening.attributes.forEach((attribute) => {
        console.log(attribute)
        propertiesElements.push({
          type: 'KeyValueProperty',
          key: {
            type: 'StringLiteral',
            value: attribute.name.value,
          },
          value: createExpressionValue(attribute.value, src),
          kind: 'init',
        })
      })
    }

    return {
      type: 'ObjectExpression',
      properties: propertiesElements,
    }
  }

  function parseAttributes(element, selector) {
    element.opening.attributes?.forEach((attribute) => {
      if (attribute.value.type === 'StringLiteral') {
        templateElements.push({
          expression: {
            type: 'StringLiteral',
            value: ` ${attribute.name.value}="${attribute.value.value}"`,
            span,
          },
        })
      } else {
        if (attribute.name.value.startsWith('on')) {
          eventsElements.push({
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'StringLiteral',
                  value: attribute.name.value.substr(2).toLowerCase(),
                },
                createExpressionValue(attribute.value, src),
                selector,
              ],
              span,
            },
          })
        } else {
          templateElements.push({
            expression: {
              type: 'StringLiteral',
              value: ' ',
              span,
            },
          })

          attributesElements.push({
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  expression: {
                    type: 'StringLiteral',
                    value: attribute.name.value,
                    span,
                  },
                },
                {
                  expression: createExpressionValue(attribute.value, src),
                },
                {
                  expression: selector,
                },
              ],
              span,
            },
          })
        }
      }
    })
  }

  function parseChildren(element, selector) {
    let idx = 0

    function parseChild(child) {
      if (child.type === 'JSXText') {
        let trimmed = child.value.trim()
        if (trimmed) {
          templateElements.push({
            expression: {
              type: 'StringLiteral',
              value: trimmed,
              span,
            },
          })

          idx++
        }
      } else {
        if (child.type === 'JSXExpressionContainer') {
          if (child.expression.type !== 'JSXEmptyExpression') {
            parseExp(child.expression, src)

            templateElements.push({
              expression: {
                type: 'StringLiteral',
                value: '',
                span,
              },
            })

            childrenElements.push({
              expression: {
                type: 'ArrayExpression',
                elements: [
                  {
                    expression: createExpressionValue(child, src),
                  },
                  {
                    expression: createSelector(selector, idx),
                  },
                ],
                span,
              },
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

  function parseElement(element, selector) {
    if (element.opening) {
      let tag = element.opening && element.opening.name.value
      let isComponent = tag.charAt(0) === tag.charAt(0).toUpperCase()

      if (isComponent) {
        templateElements.push({
          type: 'StringLiteral',
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
                  name: NAMESPACE,
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
        expression: {
          type: 'StringLiteral',
          value: `<${tag}`,
          span,
        },
      })

      if (selfClosingTags[tag]) {
        templateElements.push({
          expression: {
            type: 'StringLiteral',
            value: ` />`,
            span,
          },
        })
      } else {
        parseAttributes(element, selector)

        templateElements.push({
          expression: {
            type: 'StringLiteral',
            value: `>`,
            span,
          },
        })

        parseChildren(element, selector)

        templateElements.push({
          expression: {
            type: 'StringLiteral',
            value: `</${tag}>`,
            span,
          },
        })
      }
    }

    return element
  }

  parseElement(jsxElement, {
    type: 'ArrayExpression',
    elements: [
      {
        expression: {
          type: 'NumericLiteral',
          value: 0,
          span,
        },
      },
    ],
    span,
  })

  if (templateElements.length) {
    result.push({
      expression: {
        type: 'ArrayExpression',
        elements: templateElements,
        span,
      },
    })
  } else {
    result.push(nullExpression)
  }

  if (childrenElements.length) {
    result.push({
      expression: {
        type: 'ArrayExpression',
        elements: childrenElements,
        span,
      },
    })
  } else {
    result.push(nullExpression)
  }

  if (attributesElements.length) {
    result.push({
      expression: {
        type: 'ArrayExpression',
        elements: attributesElements,
        span,
      },
    })
  } else {
    result.push(nullExpression)
  }

  if (eventsElements.length) {
    result.push({
      expression: {
        type: 'ArrayExpression',
        elements: eventsElements,
        span,
      },
    })
  } else {
    result.push(nullExpression)
  }

  return result
}

export default function parseJSXElement(jsxElement, src) {
  jsxElement.type = 'ArrayExpression'
  jsxElement.elements = createJsxObject(jsxElement, src)
  return jsxElement
}
