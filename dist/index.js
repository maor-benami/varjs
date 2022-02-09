import csr, {createRouter} from "/lib/csr/csr.js";
import App from "./app.js";
csr(() => Var.fc(App, {
  "children": [],
  "context": {
    title: "context",
    router: createRouter()
  }
}));
