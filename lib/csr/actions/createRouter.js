import { batch, observable } from '../oberverable.js'
import { createRouterObj } from '../../router/router.js'

export default function createRouter (window) {
  window.addEventListener('popstate', () => {
    newRouterState()
  })
  
  function newRouterState () {
    let newRouterObj = createRouterObj(window.location.href)
    let newHref = newRouterObj.href
    let newPathname = newRouterObj.pathname
    let newSearch = newRouterObj.search
    let newHash = newRouterObj.hash
    let newUrl = `${newPathname}${newSearch}${newHash}`
    
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
  
  let routerObj = observable(createRouterObj(window.location.href))
  
  routerObj.navigate = (url) => {
    window.history.pushState({}, '', url)
  
    newRouterState()
  }
  
  return routerObj
}