import {Link, Route} from "./router.js";
var store = Var.observable({
  flag: false,
  color: "red",
  items1: [1, 2, 3, 4],
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
const App = props => {
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
  function mutate() {
    store.items1 = [4, 3, 2, 1];
  }
  return [["<div", ">", "<ul", ">", "", "</ul>", "</div>"], [[() => store.items1.map(item => {
    return [["<li", " ", ">", "", "</li>"], [[() => item, [0, 0]]], [["key", () => item, [0]]], null];
  }), [0, 0, 0]]], null, null];
};
export default App;
