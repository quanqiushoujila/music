<template>
  <div>
    歌手
    {{list}}
  </div>
</template>

<script>
import { getSingerList } from 'api/singer'
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
        this.list = res
      })
    }
  },
  created: function () {
  }
}
</script>

<style>
</style>
