// import jsonp from 'common/js/jsonp'
// import { commonParams, options } from './config'
import axios from 'axios'

export function getSingerList () {
  return axios.get('/api/singer').then((res) => {
    return Promise.resolve(res.data)
  })
}
