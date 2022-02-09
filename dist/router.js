import {batch} from "../lib/csr/oberverable.js";
export function Link(props) {
  const onClick = e => {
    e.preventDefault();
    if (props.href !== props.context.router.url) {
      props.context.router.navigate(props.href);
    }
  };
  return [["<a", " ", ">", "", "</a>"], [[() => props.children, [0, 0]]], [["href", () => props.href, [0]]], [["click", onClick, [0]]]];
}
function collectParam(routeChunk, routerChunk, params, routeParams) {
  let param = routeChunk.slice(1);
  if (routeParams[param] !== routerChunk) {
    params.push(() => {
      routeParams[param] = routerChunk;
    });
  }
}
function inRoute({path}, context) {
  let routerPath = context.router.pathname.split("/").slice(1);
  let routePath = path.split("/").slice(1);
  let length = Math.max(routerPath.length, routePath.length);
  let result = true;
  let params = [];
  for (let i = 0; i < length; i++) {
    let routerChunk = routerPath[i];
    let routeChunk = routePath[i];
    if (routeChunk?.startsWith(":")) {
      collectParam(routeChunk, routerChunk, params, context.router.routeParams);
    } else {
      if (routeChunk != null) {
        if (routerChunk !== routeChunk) {
          result = false;
          break;
        }
      }
    }
  }
  batch(params);
  return result;
}
export function Route(props, context) {
  return () => {
    if (inRoute(props, context)) {
      return [["<div", " ", ">", "", "</div>"], [[() => props.children, [0, 0]]], [["key", () => props.path, [0]]], null];
    } else {}
  };
}
