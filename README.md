# varjs

> isomorphic jsx framework

## components

- jsx parser
- server renderer
- browser renderer
- dev server

## features

- [x] jsx components
- [x] context
- [x] ssr
- [x] map
- [x] router
- [x] hydration
- [ ] error-boundaries
- [ ] svg
- [ ] portals
- [ ] fragments

## syntax

- var object declarations convert to observables:\
```var state = {}``` -> ```var state = observable({})```
- jsx expressions convert to functions:\
```{x}``` -> ```{() => x}```
- ^ can be escaped with round brackets:\
```{(x)}``` -> ```{x}```

## helpers

- [x] ```<Route />```
- [x] ```<Link />```
- [ ] ```<Form />```

## docs

> coming soon

## example

```jsx
function App () {
  var state = {
    color: 'red',
    title: 'Hello world'
  }
  
  return (
    <div
      class="class"
      style={`color: ${color}`}
      onClick={console.log('clicked')}
    >
      <h1>{state.title}</h1>
    </div>
  )
}
```
