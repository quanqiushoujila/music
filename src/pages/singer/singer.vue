<template>
  <div>
    歌手
  </div>
</template>

<script>
import { getSingerList } from 'api/singer'
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
    }
  },
  created: function () {
    this._getSingerList()
  }
}
</script>

<style>
</style>
