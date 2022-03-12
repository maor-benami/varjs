var store = Var.observable({
  flag: false,
  color: "red",
  title: "title",
  items1: [1, 2, 3],
  items2: [],
  getItems: async function () {
    return new Promise(resolve => {
      setTimeout(() => {
        store.items1 = [1, 2, 3];
        resolve();
      }, 1000);
    });
  }
}, "store");
export default store;
