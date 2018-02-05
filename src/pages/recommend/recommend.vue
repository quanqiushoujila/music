<template>
  <div class="recommend">
    <scroll ref="scroll" :data="recommendList" class="recommend-content">
      <div>
        <div class="slider-content" v-if="slider.length">
          <slider>
            <div v-for="(item, index) of slider" :key="index" ref="sliderWrapper">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" @load="loadImage" alt="slider" class="needsclick">
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
        <div class="recommend-list">
          <h3 class="title">推荐</h3>
          <ul>
            <li v-for="(item, index) in recommendList" :key="index" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.picurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.singername"></h2>
                <p class="desc" v-html="item.mvtitle"></p>
              </div>
            </li>
          </ul>
          <loading v-if="!recommendList.length"></loading>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getRecommend, getRecommendList } from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'

export default {
  name: 'recomment',
  components: { Slider, Loading, Scroll },
  data () {
    return {
      slider: [],
      radioList: [],
      recommendList: []
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
    },
    _getRecommendList () {
      getRecommendList().then((res) => {
        res = res.data
        if (res.code === ERR_OK) {
          this.recommendList = res.data.mvlist
        }
      })
    },
    loadImage () {
      if (!this.checkloaded) {
        this.checkloaded = true
        this.$refs.scroll.refresh()
      }
    }
  },
  created: function () {
    this._getRecommend()
    this._getRecommendList()
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
        .title {
          padding: 20px 10px;
        }
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
        .item{
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 20px 20px;
          .icon{
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          }
          .text{
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: $font-size-medium;
            .name{
              font-size: 1.2em;
              margin-bottom: 10px;
              color: $color-text;
            }
            .desc {
              color: $color-text-d;
            }
          }
          
        }
      }
    }
  }
</style>
