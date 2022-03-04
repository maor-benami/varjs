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
  const afterMount = el => new Promise(resolve => setTimeout(() => {
    resolve();
  }, 1000));
  return [["<div", " ", ">", "<p", ">", "About", "</p>", "<div", ">", "", "</div>", "<div", ">", "", "</div>", "<hr", " />", "", "", "</div>"], [[() => JSON.stringify(store.items2), [0, 1, 0]], [() => JSON.stringify(store.items1), [0, 2, 0]], [Var.fc(Link, {
    "children": ["Inner"],
    "href": "/about/inner"
  }), [0, 4]], [Var.fc(Route, {
    "children": [Var.fc(AboutInner, {
      "children": [],
      "beforeMount": beforeMount
    })],
    "path": "/about/inner"
  }), [0, 5]]], [["afterMount", afterMount, [0]]], null];
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
    store.items1 = [1, 2, 3, 4];
    store.items2 = [1, 2, 3];
    resolve();
  }, 1000));
  return [["<div", ">", "<button", ">", "change title", "</button>", "", "<h1", " ", ">", "", "</h1>", "<div", ">", "", "", "", "</div>", "<button", ">", "CLICK", "</button>", "<hr", " />", "<button", ">", "MUTATE", "</button>", "<button", ">", "TOGGLE", "</button>", "<hr", " />", "<hr", " />", "", "", "<hr", " />", "<button", ">", "ADD", "</button>", "<button", ">", "REMOVE", "</button>", "<ul", ">", "", "</ul>", "</div>"], [[Var.fc(About, {
    "children": [],
    "beforeMount": beforeMount
  }), [0, 1]], [() => context.router.url, [0, 2, 0]], [Var.fc(Link, {
    "children": ["root"],
    "href": "/"
  }), [0, 3, 0]], [Var.fc(Link, {
    "children": ["home"],
    "href": "/home"
  }), [0, 3, 1]], [Var.fc(Link, {
    "children": ["about"],
    "href": "/about"
  }), [0, 3, 2]], [Var.fc(Route, {
    "children": [[["<div", ">", "", "</div>"], [[() => context.router.routeParams.name, [0, 0]]], null, null]],
    "path": "/:name"
  }), [0, 10]], [Var.fc(Route, {
    "children": [],
    "path": "/about"
  }), [0, 11]], [() => store.items1.map(item => {
    return [["<li", " ", ">", "", "</li>"], [[() => item, [0, 0]]], [["key", item, [0]]], null];
  }), [0, 15, 0]]], [["style", () => `color: ${store.color}`, [0, 2]]], [["click", () => store.title = "new title", [0, 0]], ["click", () => {
    store.color = store.color === "red" ? "blue" : "red";
  }, [0, 4]], ["click", mutate, [0, 6]], ["click", toggle, [0, 7]], ["click", add, [0, 13]], ["click", remove, [0, 14]]]];
};
export default App;
