<template>
  <div>
    <slider></slider>
  </div>
</template>

<script>
import {getRecommend} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
export default {
  name: 'recomment',
  components: {Slider},
  data: function () {
    return {
      slider: []
    }
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          let data = res.data
          this.slider = data.slider
        }
      })
    }
  },
  created: function () {
    this._getRecommend()
  }
}
</script>

<style>
</style>
