import App from "./app.js";
import store from "./store.js";
export default function Home() {
  return [["<html", " lang=\"en\"", ">", "<head", ">", "<title", ">", "", "</title>", "<script", " src=\"/app/dev-client.js\"", ">", "</script>", "<script", " src=\"/app/hydrate.js\"", " type=\"module\"", ">", "</script>", "</head>", "<body", ">", "", "</body>", "</html>"], [[() => store.title, [0, 0, 0, 0]], [Var.fc(App, {
    "children": []
  }), [0, 1, 0]]], null, null];
}
