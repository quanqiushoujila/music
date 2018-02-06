<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @selectSinger='selectSinger'></list-view>
    <router-view/>
  </div>
</template>

<script>
import ListView from 'base/listview/listview'
import { getSingerList, getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'

const HOT_NAME = '热门'
const HOT_COUNT = 10

export default {
  name: 'singer',
  components: { ListView },
  data () {
    return {
      singers: []
    }
  },
  methods: {
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._initSinger(res.data.list)
        }
      })
    },
    _getSingerDetail (id) {
      getSingerDetail(id).then((res) => {
      })
    },
    _initSinger (data) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      data.forEach((item, index) => {
        if (index < HOT_COUNT) {
          map.hot.items.push({
            name: item.Fsinger_name,
            id: item.Fsinger_id,
            mid: item.Fsinger_mid,
            avatar: this._gePicurl(item.Fsinger_mid)
          })
        }
        const reg = /[a-zA-Z]/
        if (!reg.test(item.Findex)) {
          item.Findex = '#'
        }
        if (!map[item.Findex]) {
          map[item.Findex] = {
            title: item.Findex,
            items: []
          }
        }
        map[item.Findex].items.push({
          name: item.Fsinger_name,
          id: item.Fsinger_id,
          mid: item.Fsinger_mid,
          avatar: this._gePicurl(item.Fsinger_mid)
        })
      })
      let hot = []
      let other = []
      let ret = []

      for (let key in map) {
        let value = map[key]
        if (value.title === HOT_NAME) {
          hot.push(value)
        } else if (/[a-zA-Z]/.test(value.title)) {
          ret.push(value)
        } else {
          other.push(value)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret, other)
    },
    _gePicurl (id) {
      return `//y.gtimg.cn/music/photo_new/T001R150x150M000${id}.jpg?max_age=2592000`
    },
    selectSinger (item) {
      this._getSingerDetail(item.mid)
    }
  },
  watch: {
    list () {
      this._initSinger()
    }
  },
  created: function () {
    this._getSingerList()
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 80px;
  width: 100%;
  bottom: 0;
}
</style>
