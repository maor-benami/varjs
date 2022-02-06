var store = Var.observable({
  flag: false,
  color: "red",
  items1: [],
  items2: []
});
const Component = props => {
  const beforeMount = () => {
    return new Promise(resolve => setTimeout(() => {
      store.items1 = [1, 2, 3];
      resolve();
    }, 200));
  };
  return [["<div", ">", "<pre", ">", "", "</pre>", "<span", ">", "", "</span>", "", "</div>"], [[() => props?.context?.title, [0, 0, 0]], [() => store.items1.join(", "), [0, 1, 0]], [Var.fc(Component2, {
    "children": []
  }), [0, 2]]], null, [["beforemount", beforeMount, [0]]]];
};
const Component2 = props => {
  const beforeMount = () => {
    return new Promise(resolve => setTimeout(() => {
      store.items2 = [1, 2, 3];
      resolve();
    }, 200));
  };
  return [["<div", " ", ">", "<pre", ">", "", "</pre>", "<span", ">", "", "</span>", "</div>"], [[() => props?.context?.title, [0, 0, 0]], [() => store.items2.join(", "), [0, 1, 0]]], [["style", () => `color: ${store.color}`, [0]]], [["beforemount", beforeMount, [0]]]];
};
const App = () => {
  function add() {
    store.color = store.color === "red" ? "blue" : "red";
    store.items1.push(store.items1.length + 1);
    store.items2.push(store.items2.length + 1);
  }
  function remove() {
    store.color = store.color === "red" ? "blue" : "red";
    store.items1 = store.items1.slice(0, -1);
    store.items2 = store.items2.slice(0, -1);
  }
  function toggle() {
    store.flag = !store.flag;
  }
  return [["<div", ">", "<button", ">", "TOGGLE", "</button>", "<hr", " />", "", "<button", ">", "REMOVE", "</button>", "", "</div>"], [[() => store.flag && [["<button", ">", "ADD", "</button>"], null, null, [["click", add, [0]]]], [0, 2]], [Var.fc(Component, {
    "children": []
  }), [0, 4]]], null, [["click", toggle, [0, 0]], ["click", remove, [0, 3]]]];
};
export default App;
