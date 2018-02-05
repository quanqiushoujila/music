import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export const getRecommend = () => {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export const getRecommendList = () => {
  return axios.get('/api/recommend').then((res) => {
    return Promise.resolve(res.data)
  })
}
