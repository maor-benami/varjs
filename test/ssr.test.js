import fs from 'fs'
import parser from '../lib/parser/parser.js'
import ssr from '../lib/ssr/ssr.js'


async function testJsx(input, output, file, expectation) {
  fs.writeFileSync(file, output, 'utf8')
  
  const { App } = (await import('../' + file))
  const result = await ssr(App())
  
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