import { f, fc } from '../utils/utils.js'
import { observable, batch } from './oberverable.js'
import renderComponent from './actions/renderComponent.js'
import { createRouterObj } from '../router/router.js'

window.Var = {
  fc,
  observable
}

export function createRouter() {
  const routerObj = observable(createRouterObj(window.location.href))
  routerObj.navigate = (url) => {
    window.history.pushState({}, '', url)

    const newRouterObj = createRouterObj(window.location.href)
    const newHref = newRouterObj.href
    const newPathname = newRouterObj.pathname
    const newSearch = newRouterObj.search
    const newHash = newRouterObj.hash
    const newUrl = `${newPathname}${newSearch}${newHash}`

    batch(() => {
      if (routerObj.href !== newHref) {
        routerObj.href = newHref
      }
      if (routerObj.pathname !== newPathname) {
        routerObj.pathname = newPathname
      }
      if (routerObj.search !== newSearch) {
        routerObj.search = newSearch
      }
      if (routerObj.hash !== newHash) {
        routerObj.hash = newHash
      }
      if (routerObj.url !== newUrl) {
        routerObj.url = newUrl
      }
    })
  }

  return routerObj
}

export default function csr (subject, parent = document.body, context = {}) {
  return renderComponent(f(subject), parent, context)
}
