import {Link, Route} from "./router.js";
var store = Var.observable({
  flag: false,
  color: "red",
  items1: [1, 2, 3, 4],
  items2: []
});
const Component = (props, context) => {
  const beforeMount = () => {
    return new Promise(resolve => setTimeout(() => {
      store.items1 = [1, 2, 3];
      resolve();
    }, 200));
  };
  return [["<div", ">", "<pre", ">", "", "</pre>", "<span", ">", "", "</span>", "", "</div>"], [[() => context.title, [0, 0, 0]], [() => store.items1.join(", "), [0, 1, 0]], [Var.fc(Component2, {
    "children": []
  }), [0, 2]]], null, [["beforemount", beforeMount, [0]]]];
};
const Component2 = (props, context) => {
  const beforeMount = () => {
    return new Promise(resolve => setTimeout(() => {
      store.items2 = [1, 2, 3];
      resolve();
    }, 200));
  };
  return [["<div", " ", ">", "<pre", ">", "", "</pre>", "<span", ">", "", "</span>", "</div>"], [[() => context.title, [0, 0, 0]], [() => store.items2.join(", "), [0, 1, 0]]], [["style", () => `color: ${store.color}`, [0]]], [["beforemount", beforeMount, [0]]]];
};
const Home = () => [["<div", ">", "Home", "</div>"], null, null, null];
const About = () => [["<div", ">", "<p", ">", "About", "</p>", "<hr", " />", "", "", "</div>"], [[Var.fc(Link, {
  "children": ["Inner"],
  "href": "/about/inner"
}), [0, 2]], [Var.fc(Route, {
  "children": ["Inner"],
  "path": "/about/inner"
}), [0, 3]]], null, null];
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
  return [["<div", ">", "<div", ">", "", "", "", "</div>", "<hr", " />", "", "", "<hr", " />", "<h1", ">", "", "</h1>", "<hr", " />", "<button", ">", "MUTATE", "</button>", "<button", ">", "TOGGLE", "</button>", "<hr", " />", "<button", ">", "ADD", "</button>", "<button", ">", "REMOVE", "</button>", "<ul", ">", "", "</ul>", "</div>"], [[Var.fc(Link, {
    "children": ["root"],
    "href": "/"
  }), [0, 0, 0]], [Var.fc(Link, {
    "children": ["home"],
    "href": "/home"
  }), [0, 0, 1]], [Var.fc(Link, {
    "children": ["about"],
    "href": "/about"
  }), [0, 0, 2]], [Var.fc(Route, {
    "children": [[["<div", ">", "", "</div>"], [[() => context.router.routeParams.name, [0, 0]]], null, null]],
    "path": "/:name"
  }), [0, 2]], [Var.fc(Route, {
    "children": [Var.fc(About, {
      "children": []
    })],
    "path": "/about"
  }), [0, 3]], [() => context.router.url, [0, 5, 0]], [() => store.items1.map(item => {
    return [["<li", " ", ">", "", "</li>"], [[() => item, [0, 0]]], [["key", () => item, [0]]], null];
  }), [0, 12, 0]]], null, [["click", mutate, [0, 7]], ["click", toggle, [0, 8]], ["click", add, [0, 10]], ["click", remove, [0, 11]]]];
};
export default App;
