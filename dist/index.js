import csr, {createRouter} from "/lib/csr/csr.js";
import App from "./app.js";
import store from "./store.js";
csr(() => Var.fc(App, {
  "children": [],
  "context": {
    title: "context",
    store,
    router: createRouter()
  }
}));
