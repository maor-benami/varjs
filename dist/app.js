import {Link, Route} from "./router.js";
import store from "./store.js";
const Component = (props, context) => {
  const afterMount = () => new Promise(resolve => setTimeout(() => {
    store.items2 = [1, 2, 3];
    console.log(store.items2);
    resolve();
  }, 1000));
  return [["<div", ">", "<pre", ">", "", "</pre>", "<span", ">", "", "</span>", "", "</div>"], [[() => context.title, [0, 0, 0]], [() => store.items1.join(", "), [0, 1, 0]], [Var.fc(Component2, {
    "children": []
  }), [0, 2]]], null, null];
};
const Component2 = (props, context) => {
  return [["<div", " ", ">", "<pre", ">", "", "</pre>", "<span", ">", "", "</span>", "</div>"], [[() => context.title, [0, 0, 0]], [() => store.items2.join(", "), [0, 1, 0]]], [["style", () => `color: ${store.color}`, [0]]], null];
};
const Home = () => [["<div", ">", "Home", "</div>"], null, null, null];
const AboutInner = () => [["<div", ">", "Inner", "</div>"], null, null, null];
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
  return [["<div", ">", "<button", ">", "TOGGLE", "</button>", "<hr", " />", "<div", ">", "", "", "", "</div>", "<button", ">", "change title", "</button>", "<h1", " ", ">", "", "</h1>", "<div", ">", "", "", "", "</div>", "<button", ">", "CLICK", "</button>", "<hr", " />", "<button", ">", "MUTATE", "</button>", "<hr", " />", "", "<hr", " />", "<button", ">", "ADD", "</button>", "<button", ">", "REMOVE", "</button>", "<ul", ">", "", "</ul>", "</div>"], [[() => 1, [0, 2, 0]], [() => store.flag && 2, [0, 2, 1]], [() => 3, [0, 2, 2]], [() => context.router.url, [0, 4, 0]], [Var.fc(Link, {
    "children": ["root"],
    "href": "/"
  }), [0, 5, 0]], [Var.fc(Link, {
    "children": ["home"],
    "href": "/home"
  }), [0, 5, 1]], [Var.fc(Link, {
    "children": ["about"],
    "href": "/about"
  }), [0, 5, 2]], [Var.fc(Route, {
    "children": [[["<div", ">", "", "</div>"], [[() => context.router.routeParams.name, [0, 0]]], null, null]],
    "path": "/:name"
  }), [0, 10]], [() => store.items1.map(item => {
    return [["<li", " ", ">", "", "</li>"], [[() => item, [0, 0]]], [["key", item, [0]]], null];
  }), [0, 14, 0]]], [["style", () => `color: ${store.color}`, [0, 4]]], [["click", toggle, [0, 0]], ["click", () => store.title = "new title", [0, 3]], ["click", () => {
    store.color = store.color === "red" ? "blue" : "red";
  }, [0, 6]], ["click", mutate, [0, 8]], ["click", add, [0, 12]], ["click", remove, [0, 13]]]];
};
export default App;
