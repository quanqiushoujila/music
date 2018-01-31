<template>
  <div class="recommend" ref="sliderWrapper">
    <div class="recommend-content">
      <div class="slider-content" v-if="slider.length">
        <slider>
          <div v-for="(item, index) of slider" :key="index" ref="sliderWrapper">
            <a :href="item.linkUrl">
              <img :src="item.picUrl" alt="slider" class="needsclick">
            </a>
          </div>
        </slider>
      </div>
      <div class="recommend-list">
        <h3 class="title">电台</h3>
        <ul class="content" v-if="radioList.length">
          <li class="content-item" v-for="(item, index) of radioList" :key="index">
            <img v-lazy="item.picUrl" alt="pic">
            <p class="name">{{item.Ftitle}}</p>
          </li>
        </ul>
        <loading v-if="!radioList.length"></loading>
      </div>
    </div>
  </div>
</template>

<script>
import {getRecommend} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
import Loading from 'base/loading/loading'

export default {
  name: 'recomment',
  components: {Slider, Loading},
  data: function () {
    return {
      slider: [],
      radioList: []
    }
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          let data = res.data
          this.slider = data.slider
          this.radioList = data.radioList
        }
      })
    }
  },
  created: function () {
    this._getRecommend()
  }
}
</script>

<style lang="scss" scoped>
  @import "../../common/scss/variable";
  .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .recommend-content {
      height: 100%;
      overflow: hidden;
      .recommend-list {
        padding: 0 10px;
        margin-bottom: 10px;
        .content {
          overflow: hidden;
          .content-item {
            width: 50%;
            float: left;
            overflow: hidden;
            margin-bottom: 10px;
            img {
              width: 100%;
              display: block;
            }
            .name {
              margin: 0;
              padding: 10px;
              background-color: #333;
              color: #d7d7d7;
            }
          }
        }
      }
    }
  }
</style>
