import { Link, Route } from './router.js'
import store from './store.js'

const Component = (props, context) => {
  const afterMount = () => new Promise(resolve => setTimeout(() => {
    store.items2 = [1, 2, 3]
    console.log(store.items2)
    resolve()
  }, 1000))

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

const AboutInner = () => (
  <div>Inner</div>
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

  return (
    <div>
      <button onClick={(toggle)}>TOGGLE</button>
      <hr/>
      <div>{1}{store.flag && 2}{3}</div>
      <button onClick={() => store.title = 'new title'}>change title</button>

      <h1 style={`color: ${store.color}`}>{context.router.url}</h1>

      <div>
        <Link href="/">root</Link>
        <Link href="/home">home</Link>
        <Link href="/about">about</Link>
      </div>
      <button onClick={() => {
        store.color = store.color === 'red' ? 'blue' : 'red'
      }}>CLICK
      </button>

      <hr/>
      <button onClick={(mutate)}>MUTATE</button>

      <hr/>
      <Route path="/:name">
        <div>{context.router.routeParams.name}</div>
      </Route>
      {/*<Route path="/about">

      </Route>*/}
      <hr/>

      <button onClick={(add)}>ADD</button>
      <button onClick={(remove)}>REMOVE</button>
      <ul>
        {store.items1.map(item => {
          return (
            <li key={(item)}>{item}</li>
          )
        })}
      </ul>
    </div>
  )
}

export default App
