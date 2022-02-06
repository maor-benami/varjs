import fs from 'fs'
import parser from '../lib/parser/parser.js'
import ssr from '../lib/ssr/ssr.js'


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
    const Component = ({ children }) => <div style="color: red"><span>{1}{'2'}</span>{(children)}<Component2 /></div>
    const Component2 = ({ context }) => {
      console.log(context)
      return (
        <div style="color: blue"><span>3</span></div>
      )
    }
    export const App = () => {
        return (
        <div>
          <Component color="red" context={{
            title: 'context'
          }}>
            <div>test</div>
          </Component>
        </div>
)
    }
  `
  const output = parser(input)
  const file = 'dist/ssr-component.js'
  
  const expectation = `<div style="color: red"><span>1<!---->2</span><div>test</div><!----><div style="color: blue"><span>3</span></div></div>`
  
  return testJsx(input, output, file, expectation)
})