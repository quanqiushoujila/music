export const shuffle = (arr) => {
  const _arr = arr.slice()
  for (let i = 0, len = _arr.length; i < len; i++) {
    let j = Math.floor(Math.random(0, 1) * len)
    let val = _arr[j]
    _arr[j] = _arr[i]
    _arr[i] = val
  }
  return _arr
}
