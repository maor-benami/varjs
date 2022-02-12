import "/lib/csr/var.js";
import csr from "/lib/csr/csr.js";
import App from "./app.js";
import store from "./store.js";
import createRouter from "../lib/csr/actions/createRouter.js";
csr(window => Var.fc(App, {
  "children": [],
  "context": {
    title: "context",
    store,
    router: createRouter(window)
  }
}));
