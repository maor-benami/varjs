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

const About = (props, context) => {
  const beforeMount = () => new Promise(resolve => setTimeout(() => {
    store.items2 = [1, 2]
    resolve()
  }, 2000))

  const afterMount = (el) => new Promise(resolve => setTimeout(() => {
    resolve()
  }, 1000))

  return (
    <div afterMount={(afterMount)}>
      <p>About</p>
      <div>
        {JSON.stringify(store.items2)}
      </div>
      <div>
        {JSON.stringify(store.items1)}
      </div>
      <hr/>
      <Link href="/about/inner">Inner</Link>
      <Route path="/about/inner">
        <AboutInner beforeMount={(beforeMount)}/>
      </Route>
    </div>
  )
}

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

  const beforeMount = () => new Promise(resolve => setTimeout(() => {
    store.items1 = [1, 2, 3, 4]
    store.items2 = [1, 2, 3]
    resolve()
  }, 1000))

  return (
    <div>
      <button onClick={() => store.title = 'new title'}>change title</button>
      <About beforeMount={(beforeMount)}/>

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
      <button onClick={(toggle)}>TOGGLE</button>
      <hr/>

      <hr/>
      <Route path="/:name">
        <div>{context.router.routeParams.name}</div>
      </Route>
      <Route path="/about">

      </Route>
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
