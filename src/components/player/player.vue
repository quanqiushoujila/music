<template>
  <div class="player" v-if="playlist().length > 0">
    <transition name="normal">
      <div class="normal-player">
        <div class="background">
          <img width="100%" height="100%" :src="playlist()[currentIndex()].picUrl">
        </div>
        <div class="top">
          <div class="back"><i class="icon-back"></i></div>
          <div class="h1 title">{{playlist()[currentIndex()].songname}}</div>
          <h2 class="subtitle">{{playlist()[currentIndex()].singerName}}</h2>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player"></div>
    </transition>
    <audio :src="src" autoplay></audio>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSinger, getSingerInfo } from 'api/singer'
export default {
  name: 'player',
  data () {
    return {
      vkey: '',
      filename: '',
      src: ''
    }
  },
  methods: {
    ...mapGetters([
      'singer', 'playlist', 'currentIndex'
    ]),
    _getSingerInfo (songmid) {
      getSingerInfo(songmid).then((res) => {
        let vkey = res.data.items[0].vkey
        let filename = res.data.items[0].filename
        this.src = getSinger(vkey, filename)
      })
    },
    selectSong (item) {
      this._getSingerInfo(item.musicData.songmid)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../common/scss/variable";
.player {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: $color-background;
  .normal-player {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      filter: blur(20px);
      opacity: .6;
      z-index: -1;
    }
    .top {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
    }
  }
}
.player-enter-active, .player-leave-active {
  transition: all .3;
}
.player-enter, .player-leave-to {
  transform: translate3d(100%, 0, 0)
}
</style>
