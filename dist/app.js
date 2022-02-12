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
const About = (props, context) => {
  const beforeMount = () => new Promise(resolve => setTimeout(() => {
    store.items2 = [1, 2];
    resolve();
  }, 2000));
  const afterMount = () => new Promise(resolve => setTimeout(() => {
    console.log("after");
    resolve();
  }, 1000));
  return [["<div", " ", ">", "<p", ">", "About", "</p>", "<div", ">", "", "</div>", "<hr", " />", "", "", "</div>"], [[() => JSON.stringify(store.items2), [0, 1, 0]], [Var.fc(Link, {
    "children": ["Inner"],
    "href": "/about/inner"
  }), [0, 3]], [Var.fc(Route, {
    "children": [Var.fc(AboutInner, {
      "children": [],
      "beforeMount": beforeMount
    })],
    "path": "/about/inner"
  }), [0, 4]]], [["afterMount", afterMount, [0]]], null];
};
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
  const beforeMount = () => new Promise(resolve => setTimeout(() => {
    store.items2 = [1, 2, 3];
    resolve();
  }, 1000));
  return [["<div", ">", "", "<h1", ">", "", "</h1>", "<div", ">", "", "", "", "</div>", "<hr", " />", "<button", ">", "MUTATE", "</button>", "<button", ">", "TOGGLE", "</button>", "<hr", " />", "<button", ">", "ADD", "</button>", "<button", ">", "REMOVE", "</button>", "<ul", ">", "", "</ul>", "</div>"], [[Var.fc(About, {
    "children": [],
    "beforeMount": beforeMount
  }), [0, 0]], [() => context.router.url, [0, 1, 0]], [Var.fc(Link, {
    "children": ["root"],
    "href": "/"
  }), [0, 2, 0]], [Var.fc(Link, {
    "children": ["home"],
    "href": "/home"
  }), [0, 2, 1]], [Var.fc(Link, {
    "children": ["about"],
    "href": "/about"
  }), [0, 2, 2]], [() => store.items1.map(item => {
    return [["<li", " ", ">", "", "</li>"], [[() => item, [0, 0]]], [["key", item, [0]]], null];
  }), [0, 9, 0]]], null, [["click", mutate, [0, 4]], ["click", toggle, [0, 5]], ["click", add, [0, 7]], ["click", remove, [0, 8]]]];
};
export default App;
