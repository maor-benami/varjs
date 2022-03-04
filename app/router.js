import { batch } from '../lib/csr/oberverable.js'

export function Link (props, context) {
  const onClick = (e) => {
    e.preventDefault()

    let callback = () => {
      context.router.navigate(props.href)
      props.afterRoute()
    }

    if (props.href !== context.router.url) {
      if (props.beforeRoute) {
        let result = props.beforeRoute()

        if (result?.then) {
          return result.then(callback)
        }

        callback()
      }
    }
  }

  return (
    <a href={props.href} onClick={(onClick)}>{(props.children)}</a>
  )
}

function collectParam (routeChunk, routerChunk, params, routeParams) {
  let param = routeChunk.slice(1)

  if (routeParams[param] !== routerChunk) {
    params.push(() => {
      routeParams[param] = routerChunk
    })
  }
}

function inRoute ({ path }, context) {
  console.log(context.router.pathname, path)
  let routerPath = context.router.pathname.split('/').slice(1)
  let routePath = path.split('/').slice(1)
  let length = Math.max(routerPath.length, routePath.length)
  let result = true
  let params = [() => {
    context.router.params = []
  }]

  for (let i = 0; i < length; i++) {
    let routerChunk = routerPath[i]
    let routeChunk = routePath[i]


    if (routeChunk?.startsWith(':')) {
      collectParam(routeChunk, routerChunk, params, context.router.routeParams)
    } else {
      if (routeChunk != null) {
        if (routerChunk !== routeChunk) {
          result = false
          break
        }
      }
    }
  }

  batch(params)

  return result
}

export function Route (props, context) {
  return () => {
    if (inRoute(props, context)) {
      return (
        <div key={props.path}>{(props.children)}</div>
      )
    }
  }
}
