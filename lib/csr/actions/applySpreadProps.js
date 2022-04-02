export default function applySpreadProps(subject, props) {
  Object.keys(props).forEach((prop) => {
    if (prop === 'children') return
    if (prop.startsWith('on')) {
      if (!subject[3]) subject[3] = []
      subject[3].push([prop.substr(2).toLowerCase(), props[prop], [0]])
    } else {
      if (!subject[2]) subject[2] = []
      subject[2].push([prop, props[prop], [0]])
    }
  })
}
