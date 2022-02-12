var store = Var.observable({
  flag: false,
  color: "red",
  title: "title",
  items1: [],
  items2: [],
  getItems: async function () {}
}, "store");
export default store;
