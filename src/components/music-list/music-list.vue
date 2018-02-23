<template>
  <div class="music-list">
    <div class="music-header" ref="musicHeader">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <h1 class="title" v-html="title"></h1>
    </div>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" 
            class="list" 
            ref="list" 
            :probe-type="probeType"
            :listen-scroll= 'listenScroll'
            @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
    
  </div>
</template>

<script>
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { mapActions } from 'vuex'
// import { songmixin } from 'common/js/mixin'

const HEADERHEIGHT = 40
const IMAGEPOSTOP = '70%'

export default {
  name: '',
  // mixins: [songmixin],
  data () {
    return {
      songList: [],
      imageHeight: 0
    }
  },
  props: {
    songs: {
      type: Array
    },
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    }
  },
  computed: {
    bgImageStyle () {
      return `background-image: url(${this.bgImage})`
    }
  },
  components: {
    SongList, Scroll, Loading
  },
  created () {
    this.listenScroll = true
    this.probeType = 3
    this.layerScrollTop = 0
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.$refs.list.$el.style.top = this.imageHeight + 'px'
    this.layerScrollTop = this.imageHeight - HEADERHEIGHT
  },
  methods: {
    ...mapActions([
      'selectPlay'
    ]),
    back () {
      this.$router.back()
    },
    selectItem (item, index) {
      this.selectPlay({list: this.songs, index})
    },
    scroll (pos) {
      let posY = pos.y
      let scale = 0

      if (posY > 0) {
        scale = (posY / this.imageHeight) + 1
        this.$refs.bgImage.style.zIndex = 10
        this.$refs.bgImage.style.transform = `scale(${scale})`
      } else {
        this.$refs.bgImage.style.zIndex = 0
        if (this.layerScrollTop >= -posY) {
          this.$refs.layer.style.top = posY + 'px'
          this.$refs.bgImage.style.zIndex = 0
          this.$refs.bgImage.style.paddingTop = IMAGEPOSTOP
          this.$refs.playBtn.style.display = 'block'
        } else {
          this.$refs.layer.style.top = `-${this.layerScrollTop}px`
          this.$refs.bgImage.style.paddingTop = '40px'
          this.$refs.bgImage.style.zIndex = 10
          this.$refs.playBtn.style.display = 'none'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";
  .music-list {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
    .music-header {
      position: absolute;
      top: 0;
      width: 100%;
      height: 40px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 10px;
          font-size: $font-size-large-x;
          color: $color-theme;
        }
      }
      .title {
        position: absolute;
        top: 0;
        left: 10%;
        z-index: 40;
        width: 80%;
        text-align: center;
        line-height: 40px;
        font-size: $font-size-large;
        color: $color-text;
      }
    }
    .bg-image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;
      .play-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 100%;
        .play {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
          .icon-play {
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
            font-size: $font-size-medium-x;
          }
          .text {
            display: inline-block;
            vertical-align: middle;
            font-size: $font-size-small;
          }
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .bg-layer {
      position: relative;
      height: 100%;
      background: $color-background;
    }
    .list {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      background: $color-background;
      .song-list-wrapper {
        padding: 20px 30px;
      }
      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>
