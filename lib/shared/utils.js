export let f = (f) => f && (f.call ? f() : f)

export function fc (...args) {
  return args
}

export function makeContext (props, context) {
  if (!context.mounts) {
    context.mounts = []
  }
  
  if (props?.context) {
    Object.keys(props.context).forEach(key => {
      context[key] = props.context[key]
    })
  }
}
