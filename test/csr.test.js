import fs from 'fs'
import { JSDOM } from 'jsdom'
import parser from '../lib/parser/parser.js'
import csr from '../lib/csr/csr.js'

test('div', async () => {
  const DOM = new JSDOM()
  const { document } = DOM.window
  const input = `export const App = () => <div></div>`
  const output = parser(input)
  const file = 'dist/csr-div.js'

  fs.writeFileSync(file, output, 'utf8')

  const { App } = await import('../' + file)

  csr(App(), document.body)

  expect(DOM.serialize()).toEqual(
    `<html><head></head><body><div></div></body></html>`,
  )
  fs.rmSync(file)
})

test('hr', async () => {
  const DOM = new JSDOM()
  const { document } = DOM.window
  const input = `export const App = () => <hr />`
  const output = parser(input)
  const file = 'dist/csr-hr.js'

  fs.writeFileSync(file, output, 'utf8')

  const { App } = await import('../' + file)

  csr(App(), document.body)

  expect(DOM.serialize()).toEqual(
    `<html><head></head><body><hr></body></html>`,
  )
  fs.rmSync(file)
})
