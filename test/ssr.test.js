import fs from 'fs'
import parser from '../lib/parser/parser.js'
import ssr from '../lib/ssr/ssr.js'

var Var = {
  fc: (func, props) => func(props)
}

global.Var = Var

test('div', async () => {
  const input = `export const App = () => <div></div>`
  const output = parser(input)
  const file = 'dist/ssr-div.js'
  
  fs.writeFileSync(file, output, 'utf8')
  
  const { App } = (await import('../' + file))
  const result = ssr(App())
  
  expect(result).toEqual('<div></div>')
  fs.rmSync(file)
})

test('hr', async () => {
  const input = `export const App = () => <hr />`
  const output = parser(input)
  const file = 'dist/ssr-hr.js'
  
  fs.writeFileSync(file, output, 'utf8')
  
  const { App } = (await import('../' + file))
  const result = ssr(App())
  
  expect(result).toEqual('<hr />')
  fs.rmSync(file)
})

test('component', async () => {
  const input = `
    const Component = () => <div></div>
    export const App = () => <Component title="test" />
  `
  const output = parser(input)
  const file = 'dist/ssr-component.js'
  
  fs.writeFileSync(file, output, 'utf8')
  
  const { App } = (await import('../' + file))
  const result = ssr(App())
  expect(result).toEqual('<div></div>')
  fs.rmSync(file)
})