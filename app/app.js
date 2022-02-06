var store = {
  flag: false,
  color: 'red',
  items1: [1, 2, 3, 4],
  items2: [],
}

const Component = (props) => {
  const beforeMount = () => {
    return new Promise(resolve => setTimeout(() => {
      store.items1 = [1, 2, 3]
      resolve()
    }, 200))
  }
  return (
    <div onBeforeMount={(beforeMount)}>
      <pre>{props?.context?.title}</pre>
      <span>{store.items1.join(', ')}</span>
      <Component2/>
    </div>
  )
}

const Component2 = (props) => {
  const beforeMount = () => {
    return new Promise(resolve => setTimeout(() => {
      store.items2 = [1, 2, 3]
      resolve()
    }, 200))
  }
  return (
    <div onBeforeMount={(beforeMount)} style={`color: ${store.color}`}>
      <pre>{props?.context?.title}</pre>
      <span>{store.items2.join(', ')}</span>
    </div>
  )
}

const App = () => {
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
    store.items1 = [4,3,2,1]
  }
  
  return (
    <div>
      <button onClick={(mutate)}>MUTATE</button>
      {/*<button onClick={toggle}>TOGGLE</button>
      <hr/>
      <button onClick={add}>ADD</button>
      <button onClick={remove}>REMOVE</button>
      <Component/>*/}
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