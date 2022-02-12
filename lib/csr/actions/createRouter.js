import { batch, observable } from '../oberverable.js'
import { createRouterObj } from '../../router/router.js'

export default function createRouter () {
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