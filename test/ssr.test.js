import fs from 'fs'
import parser from '../lib/parser/parser.js'
import ssr from '../lib/ssr/ssr.js'

var Var = {
  fc: (func, props) => func(props)
}

global.Var = Var

async function testJsx(input, output, file, expectation) {
  fs.writeFileSync(file, output, 'utf8')
  
  const { App } = (await import('../' + file))
  const result = ssr(App())
  
  expect(result).toEqual(expectation)
  fs.rmSync(file)
}

test('div', async () => {
  const input = `export const App = () => <div style="color: red" class={'test'}>test</div>`
  const output = parser(input)
  const file = 'dist/ssr-div.js'
  const expectation = `<div style="color: red" class="test">test</div>`
  
  return testJsx(input, output, file, expectation)
})

test('hr', async () => {
  const input = `export const App = () => <hr />`
  const output = parser(input)
  const file = 'dist/ssr-hr.js'
  const expectation = `<hr />`
  
  return testJsx(input, output, file, expectation)
})

test('component', async () => {
  const input = `
    const Component = ({ color }) => <div style="color: red"></div>
    export const App = () => <Component color="red" />
  `
  const output = parser(input)
  const file = 'dist/ssr-component.js'
  const expectation = `<div style="color: red"></div>`
  
  return testJsx(input, output, file, expectation)
})