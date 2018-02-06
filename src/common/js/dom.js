let addClass = (el, className) => {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

const hasClass = (el, className) => {
  const reg = new RegExp('(^|\\s)' + className + '($|\\s)')
  return reg.test(el.className)
}

const getData = (el, name, val) => {
  const attr = 'data-' + name
  if (val) {
    return el.setAttribute(attr, val)
  } else {
    return el.getAttribute(attr)
  }
}

export {addClass, hasClass, getData}
