export default function removeChild (child) {
  if (child) {
    if (child._subs) {
      child._subs.forEach(sub => sub())
    }
    
    child.remove()
  }
}