export function Link (props) {
  const onClick = (e) => {
    e.preventDefault()

    if (props.href !== props.context.router.url) {
      props.context.router.navigate(props.href)
    }
  }

  return (
    <a href={props.href} onClick={(onClick)}>{(props.children)}</a>
  )
}

export function Route (props) {
  return () => {
    let routerPath = props.context.router.pathname.split('/').slice(1)
    let routePath = props.path.split('/').slice(1)
    let inRoute = true

    for (let i = 0; i < routerPath.length; i++) {
      let routerChunk = routerPath[i]
      let routeChunk = routePath[i]

      if (routerChunk !== routeChunk) {
        inRoute = false
        break;
      }
    }

    if (inRoute) {
      return (
        <div key={props.path}>{(props.children)}</div>
      )
    } else {

    }
  }
}
