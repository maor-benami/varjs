import {Link, Route} from "./router.js";
var store = Var.observable({
  flag: false,
  color: "red",
  items1: [1, 2, 3, 4],
  items2: []
});
const Component = (props, context) => {
  return [["<div", ">", "<pre", ">", "", "</pre>", "<span", ">", "", "</span>", "", "</div>"], [[() => context.title, [0, 0, 0]], [() => store.items1.join(", "), [0, 1, 0]], [Var.fc(Component2, {
    "children": []
  }), [0, 2]]], null, null];
};
const Component2 = (props, context) => {
  return [["<div", " ", ">", "<pre", ">", "", "</pre>", "<span", ">", "", "</span>", "</div>"], [[() => context.title, [0, 0, 0]], [() => store.items2.join(", "), [0, 1, 0]]], [["style", () => `color: ${store.color}`, [0]]], null];
};
const Home = () => [["<div", ">", "Home", "</div>"], null, null, null];
const About = (props, context) => [["<div", ">", "<p", ">", "About", "</p>", "<div", ">", "", "</div>", "<hr", " />", "", "", "</div>"], [[() => JSON.stringify(store.items2), [0, 1, 0]], [Var.fc(Link, {
  "children": ["Inner"],
  "href": "/about/inner"
}), [0, 3]], [Var.fc(Route, {
  "children": ["Inner"],
  "path": "/about/inner"
}), [0, 4]]], null, null];
const App = (props, context) => {
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
  const beforeMount = () => {
    return new Promise(resolve => setTimeout(() => {
      store.items2 = [1, 2, 3];
      resolve();
    }, 1000));
  };
  return [["<div", ">", "", "</div>"], [[Var.fc(About, {
    "children": [],
    "onBeforeMount": beforeMount
  }), [0, 0]]], null, null];
};
export default App;
