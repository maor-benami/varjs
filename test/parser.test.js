import parser from '../lib/parser/parser.js'

test('div', () => {
  const input = `const div = <div></div>`
  const output = parser(input).trim()
  
  expect(output).toEqual(`const div = [["<div", ">", "</div>"], null, null, null];`)
})

test('App()', () => {
  const input = `const App = () => <div></div>`
  const output = parser(input).trim()
  
  expect(output).toEqual(`const App = () => [["<div", ">", "</div>"], null, null, null];`)
})