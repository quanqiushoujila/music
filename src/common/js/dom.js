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

export {addClass, hasClass}
