import "/lib/csr/var.js";
import csr from "/lib/csr/csr.js";
import Home from "./home.js";
import store from "./store.js";
import createRouter from "../lib/csr/actions/createRouter.js";
csr(() => Var.fc(Home, {
  "children": [],
  "context": {
    title: "context",
    store,
    router: createRouter()
  }
}));
