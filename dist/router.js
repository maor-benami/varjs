export function Link(props) {
  const onClick = e => {
    e.preventDefault();
    if (props.href !== props.context.router.url) {
      props.context.router.navigate(props.href);
    }
  };
  return [["<a", " ", ">", "", "</a>"], [[() => props.children, [0, 0]]], [["href", () => props.href, [0]]], [["click", onClick, [0]]]];
}
export function Route(props) {
  return () => {
    let routerPath = props.context.router.pathname.split("/").slice(1);
    let routePath = props.path.split("/").slice(1);
    let inRoute = true;
    for (let i = 0; i < routerPath.length; i++) {
      let routerChunk = routerPath[i];
      let routeChunk = routePath[i];
      if (routerChunk !== routeChunk) {
        inRoute = false;
        break;
      }
    }
    if (inRoute) {
      return [["<div", " ", ">", "", "</div>"], [[() => props.children, [0, 0]]], [["key", () => props.path, [0]]], null];
    } else {}
  };
}
