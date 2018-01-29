import originJSONP from 'jsonp'

export default function jsonp (url, data, opts) {
  url += url.indexOf('?') ? '?' : '&' + params(data)
  url = url.replace('?&', '?')
  return new Promise((resolve, reject) => {
    originJSONP(url, opts, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function params (data) {
  let url = ''
  let enc = encodeURIComponent
  for (let k of data) {
    data[k] = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${enc(data[k])}`
  }
  return url ? url.substring(1) : ''
}
