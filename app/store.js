var store = {
  flag: false,
  color: 'red',
  title: 'title',
  items1: [],
  items2: [],
  getItems: async function () {
    return new Promise(resolve => {
      setTimeout(() => {
        store.items1 = [1, 2, 3]
        resolve()
      }, 1000)
    })
  }
}

export default store
