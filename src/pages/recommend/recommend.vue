<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-content" v-if="slider.length">
        <slider>
          <div v-for="(item, index) of slider" :key="index">
            <a :href="item.linkUrl">
              <img :src="item.picUrl" alt="slider">
            </a>
          </div>
        </slider>
      </div>
    </div>
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

<style lang="scss" scope>

</style>
