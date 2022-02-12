import '/lib/csr/var.js'
import hydrate  from '/lib/csr/hydrate.js'
import Home from './home.js'
import store from './store.js'
import createRouter from '../lib/csr/actions/createRouter.js'

hydrate((window) => <Home
  context={{ title: 'context', store, router: createRouter(window) }}/>)
