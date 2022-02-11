import { Link, Route } from './router.js'

var store = {
  flag: false,
  color: 'red',
  items1: [1, 2, 3, 4],
  items2: [],
}

const Component = (props, context) => {
  return (
    <div>
      <pre>{context.title}</pre>
      <span>{store.items1.join(', ')}</span>
      <Component2/>
    </div>
  )
}

const Component2 = (props, context) => {
  return (
    <div style={`color: ${store.color}`}>
      <pre>{context.title}</pre>
      <span>{store.items2.join(', ')}</span>
    </div>
  )
}

const Home = () => (
  <div>Home</div>
)

const About = (props, context) => (
  <div>
    <p>About</p>
    <div>
      {JSON.stringify(store.items2)}
    </div>
    <hr/>
    <Link href='/about/inner'>Inner</Link>
    <Route path="/about/inner">
      Inner
    </Route>
  </div>
)

const App = (props, context) => {
  function add () {
    store.color = store.color === 'red' ? 'blue' : 'red'
    store.items1.push(store.items1.length + 1)
    store.items2.push(store.items2.length + 1)
  }

  function remove () {
    store.color = store.color === 'red' ? 'blue' : 'red'
    store.items1 = store.items1.slice(0, -1)
    store.items2 = store.items2.slice(0, -1)
  }

  function toggle () {
    store.flag = !store.flag
  }

  function mutate () {
    store.items1 = [4, 3, 2, 1]
  }

  const beforeMount = () => {
    return new Promise(resolve => setTimeout(() => {
      store.items2 = [1, 2, 3]
      resolve()
    }, 1000))
  }

  return (
    <div>
      <About onBeforeMount={(beforeMount)} />

      {/*<div>
        <Link href="/">root</Link>
        <Link href="/home">home</Link>
        <Link href="/about">about</Link>
      </div>
      <hr/>
      <Route path="/:name">
        <div>{context.router.routeParams.name}</div>
      </Route>
      <Route path="/about">
      </Route>
      <hr/>
      <h1>{context.router.url}</h1>
      <hr/>
      <button onClick={(mutate)}>MUTATE</button>
      <button onClick={toggle}>TOGGLE</button>
      <hr/>
      <button onClick={add}>ADD</button>
      <button onClick={remove}>REMOVE</button>
      <ul>
        {store.items1.map(item => {
          return (
            <li key={(item)}>{item}</li>
          )
        })}
      </ul>*/}
    </div>
  )
}

export default App
