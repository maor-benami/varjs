function renderComponentToString (component) {
  let [tmpl] = component
  let result = ''
  
  for (let chunk of tmpl) {
    result += chunk
  }
  
  return result
}

export default function ssr (subject) {
  return renderComponentToString(subject)
}