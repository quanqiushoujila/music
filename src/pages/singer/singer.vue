<template>
  <div>
    歌手
  </div>
</template>

<script>
import { getSingerList, getSingerDisc } from 'api/singer'
import { ERR_OK } from 'api/config'
export default {
  name: 'singer',
  data () {
    return {
      list: null
    }
  },
  methods: {
    _getSingerList () {
      getSingerList().then((res) => {
        res = res.data
        if (res.code === ERR_OK) {
          this.list = res.data
        }
      })
    },
    _getSingerDisc () {
      getSingerDisc().then((res) => {
        console.log('222', res)
      })
    }
  },
  created: function () {
    this._getSingerList()
    this._getSingerDisc()
  }
}
</script>

<style>
</style>
