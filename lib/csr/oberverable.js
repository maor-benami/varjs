let BATCH = false,
  CONSTRUCTOR = 'constructor',
  LENGTH = 'length',
  _key = Symbol('_key'),
  _subs = Symbol('_subs'),
  _parent = Symbol('_parent'),
  FUNC = null,
  EL = null,
  TIMEOUT = null,
  QUEUE = new Set()

import {
  isArray,
  isFunction,
  isMap,
  isProxy,
  isSet,
  isSymbol,
} from '../shared/is.js'

let trigger = (target, p) => {
  if (target[_subs] && target[_subs][p]) {
    if (BATCH) {
      return queueSubs(target[_subs][p])
    }
    target[_subs][p].forEach((eff) => eff())
  }

  if (target[_parent]) {
    runParent(target)
  }
}
let subscribe = (target, p, FUNC, EL) => {
  if (!target[_subs]) target[_subs] = {}

  if (!target[_subs][p]) {
    target[_subs][p] = new Set()
  }

  target[_subs][p].add(FUNC)

  if (target[_parent] && target[_parent][_subs]) {
    if (!isArray(target)) target[_parent][_subs].delete(FUNC)
  }

  if (EL) {
    if (!EL._subs) {
      EL._subs = new Set()
    }

    EL._subs.add(() => {
      if (target[_subs][p]) {
        target[_subs][p].delete(FUNC)

        if (target[_subs][p].size === 0) delete target[_subs][p]
      }
    })
  }
}
let runParent = (target) => {
  let parent = target[_parent]

  if (parent[_parent]) {
    runParent(parent)
  }

  if (parent && parent[_subs]) {
    queueSubs(parent[_subs])
  }
}
let queueSubs = (subs) => {
  subs.forEach((eff) => QUEUE.add(eff))
  clearTimeout(TIMEOUT)
  TIMEOUT = setTimeout(() => {
    QUEUE.forEach((eff) => eff())
    QUEUE = new Set()
  })
}

export let observe = (func, el) => {
  EL = el
  FUNC = func
  FUNC = func()
  FUNC = null
  EL = null
}
export let observable = (obj, name) => {
  
  if (window._CONTEXT_ && window._CONTEXT_[name]) {
    Object.assign(obj, window._CONTEXT_[name])
  }
  
  if (isProxy(obj)) {
    if (isMap(obj)) {
      [...obj.keys()].forEach((key) => {
        obj.set(key, observable(obj.get(key)))
      })
    } else if (isSet(obj)) {
      let newSet = []
      obj.forEach((item) => newSet.push(observable(item)))
      obj = new Set(newSet)
    }

    return new Proxy(obj, {
      get: (target, p, re) => {
        if (p === CONSTRUCTOR || p === LENGTH || isFunction(p) || isSymbol(p))
          return target[p]

        if (isFunction(target[p])) {
          let res = Reflect.get(target, p, re)
          let orig = res

          if (isSet(target)) {
            res = function () {
              if (p === 'add') {
                if (arguments[0]) arguments[0] = observable(arguments[0])
                let result = orig.apply(target, arguments)
                trigger(target, target[_key], 1, 0)
                return result
              }
              if (p === 'delete') {
                Array.from(target).forEach((item, i) => {
                  if (i === arguments[0]) {
                    target.delete(item)
                  }
                })
                let result = orig.apply(target, arguments)
                trigger(target, p)
                return result
              }
              return orig.apply(target, arguments)
            }
          }

          if (isMap(target)) {
            res = function () {
              if (p === 'set' || p === 'delete') {
                if (p === 'set' && arguments[1]) arguments[1] = observable(
                  arguments[1])
                let result = orig.apply(target, arguments)

                trigger(target, p)
                return result
              }
              return orig.apply(target, arguments)
            }
          }

          return res
        }

        if (FUNC && isNaN(p)) {
          subscribe(target, p, FUNC, EL)
        }

        if (isProxy(target[p]) && !target[p][_key]) {
          target[p] = observable(target[p])
          target[p][_key] = p
          target[p][_parent] = {
            [_key]: target[_key] && target[_key],
            [_subs]: target[_subs] && target[_subs][p],
            [_parent]: target[_parent] && target[_parent],
          }
        }

        return target[p]
      },
      set: (target, p, v) => {
        if (p === LENGTH || isSymbol(p)) {
          target[p] = v
          return 1
        }
        
        if (isFunction(target[p])) {
          return 1
        }

        if (isArray(target[p])) {
          if (target[p].length === 0 && v.length === 0) return 1
          target[p] = v
          trigger(target, p)
        } else if (target[p] !== v) {
          target[p] = v
          if (!isFunction(v)) {
            trigger(target, p)
          }
        }

        return 1
      },
      deleteProperty (target, p) {
        if (isSymbol(p)) {
          delete target[p]
          return 1
        }

        delete target[p]
        trigger(target, p)

        return 1
      },
    })
  } else {
    return obj
  }
}
export let unsubscribe = (element) => {
  Array.from(element).forEach(unsubscribe)

  if (element[_subs]) {
    element[_subs].forEach((eff) => eff())
  }
}
export let batch = (subject) => {
  let callback = () => (BATCH = false)
  BATCH = true

  if (isArray(subject)) {
    subject.forEach(eff => eff())
    callback()
  } else {
    if (subject.then) {
      subject.then(callback)
    } else {
      subject()
      callback()
    }
  }

}
