function Component(props) {
  return Var.fc(Component2, {
    "children": ["123"],
    ...props
  });
}
function Component2(props) {
  return [["<div", () => props, ">", "123", "</div>"], null, null, null];
}
function App() {
  return Var.fc(Component, {
    "style": "color: red",
    "onClick": () => console.log(77)
  });
}
export default App;
