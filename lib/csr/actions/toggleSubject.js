import removeChild from './removeChild.js'

export default function toggleSubject (subject, parent, context, index) {
  let childTarget = parent.childNodes[index]

  if (childTarget?.nodeType !== 8) {
    let comment = document.createComment(String(index))
    parent.insertBefore(comment, childTarget)
    removeChild(childTarget)
  }
}
