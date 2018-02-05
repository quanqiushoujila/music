import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export const getSingerList = () => {
  return axios.get('/api/singer').then((res) => {
    return Promise.resolve(res.data)
  })
}
export const getSingerDisc = () => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: '0025NhlN2yWrP4',
    order: 'listen',
    begin: 0,
    num: 30,
    songstatus: 1
  })

  return jsonp(url, data, options)
}
