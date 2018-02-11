<template>
  <div class="player" v-if="singer.length">
    <transition name="normal">
      <div class="normal-player">
        <div class="background">
          <img width="100%" height="100%">
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
      'singer'
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
  z-index: 100;
  background-color: $color-background;
}
.player-enter-active, .player-leave-active {
  transition: all .3;
}
.player-enter, .player-leave-to {
  transform: translate3d(100%, 0, 0)
}
</style>
