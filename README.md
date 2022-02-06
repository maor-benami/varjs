# varjs

isomorphic jsx framework

## components

- jsx parser
- server renderer
- browser renderer
- dev server

## features

- [x] jsx components
- [x] context
- [x] ssr
- [ ] map
- [ ] router
- [ ] hydration
- [ ] fragments

## syntax

- var object declarations convert to observables:\
```var state = {}``` -> ```var state = observable({})```
- jsx expressions convert to functions:\
```{x}``` -> ```{() => x}```
- ^ can be escaped with round brackets:\
```{(x)}``` -> ```{x}```

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