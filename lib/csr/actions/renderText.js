export default function renderText (subject, parent, context, index) {
  const text = document.createTextNode(String(subject))
  parent.append(text)
}