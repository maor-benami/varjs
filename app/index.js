import csr, { createRouter } from '/lib/csr/csr.js'
import App from './app.js'

csr(() => <App context={{ title: 'context', router: createRouter() }} />)
