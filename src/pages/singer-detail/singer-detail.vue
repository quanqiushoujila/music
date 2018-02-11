<template>
  <transition name="singer">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'

export default {
  name: '',
  components: {
    MusicList
  },
  data () {
    return {
      songs: [],
      title: '',
      bgImage: ''
    }
  },
  created () {
    this._getSingerDetail(this.getSinger().mid)
    this.title = this.getSinger().name
    this.bgImage = this.getSinger().avatar
  },
  methods: {
    ...mapGetters({
      getSinger: 'singer'
    }),
    _getSingerDetail (id) {
      if (!this.getSinger().mid) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(id).then((res) => {
        if (ERR_OK === res.code) {
          this.songs = res.data.list
        }
      })
    }
  }
}
</script>

<style  lang="scss" scoped>
  .singer-enter-active, .singer-leave-active {
    transition: all .3s;
  }
  .singer-enter, .singer-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
