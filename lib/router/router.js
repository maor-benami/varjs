function getRouteParams () {

}

export function createRouterObj (url) {
  const urlObj = new URL(url)
  const searchParams = {}

  for (const [key, value] of urlObj.searchParams.entries()) {
    searchParams[key] = value
  }

  return {
    href: urlObj.href,
    pathname: urlObj.pathname,
    search: urlObj.search,
    hash: urlObj.hash,
    url: `${urlObj.pathname}${urlObj.search}${urlObj.hash}`,
    searchParams,
    routeParams: {}
  }
}
