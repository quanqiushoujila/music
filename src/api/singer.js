import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import { setCookie, getCookie } from 'common/js/cookie'
// import axios from 'axios'

// const GUID = 3126304037
const GUID = 6604877730

export const getSingerList = () => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, options)
}

export const getSingerDetail = (id) => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  let data = Object.assign({}, commonParams, {
    hostUin: 0,
    loginUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: id,
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1
  })

  return jsonp(url, data, options)
}

export const getSingerInfo = (songmid) => {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const filename = 'C400' + songmid + '.m4a'
  // const t = (new Date()).getUTCMilliseconds()
  // _guid = Math.round(2147483647 * Math.random()) * t % 1e10

  let data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    songmid: songmid, // data.musicData.songmid
    filename: filename, // 'C400${data.musicData.songmid}.m4a',
    guid: _guid() // 3126304037
  })
  return jsonp(url, data)
}

export const getSinger = (vkey, filename) => {
  const url = 'http://dl.stream.qqmusic.qq.com/' + filename
  const data = {
    vkey: vkey,
    guid: _guid(),
    uin: 0,
    fromtag: 66
  }
  return _urlFormat(url, data)
}

const _urlFormat = (url, data) => {
  if (!data) {
    return
  }
  let search = `?`
  for (let key in data) {
    search += `${key}=${data[key]}&`
  }
  return url + search.slice(0, -1)
}

const _guid = () => {
  const name = 'pgv_pvid'
  if (getCookie(name) === '') {
    setCookie(name, GUID)
  }
  return getCookie(name)
}
