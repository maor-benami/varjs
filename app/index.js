import '/lib/csr/var.js'
import csr from '/lib/csr/csr.js'
// import App from './app.js'
import Home from './home.js'
import store from './store.js'
import hydrate from '../lib/csr/hydrate.js'
import createRouter from '../lib/csr/actions/createRouter.js'
// import createRouter from '../lib/csr/actions/createRouter.js'

// csr((window) => <App
//   context={{ title: 'context', store, router: createRouter(window) }}/>)

csr(() => <Home
  context={{ title: 'context', store, router: createRouter() }}/>)
