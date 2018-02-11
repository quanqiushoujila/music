export const setCookie = (name, val) => {
  document.cookie = `${name}=${val}`
}

export const getCookie = (name) => {
  const cookie = document.cookie
  if (cookie.length > 0) {
    let start = cookie.indexOf(`${name}=`)
    let end = -1
    if (start !== -1) {
      start = start + name.length + 1
      end = cookie.indexOf(';', start)
      if (end === -1) {
        end = cookie.length
      }
      return cookie.substring(start, end)
    }
  } else {
    return ''
  }
}
