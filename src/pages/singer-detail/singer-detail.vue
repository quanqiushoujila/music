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
          const data = res.data
          const list = data.list
          for (let i = 0; i < list.length; i++) {
            const music = list[i].musicData
            let song = {
              singername: data.singer_name,
              singermid: data.singer_mid,
              singerid: data.singer_id,
              albumname: music.albumname,
              songname: music.songname,
              albummid: music.albummid,
              songmid: music.songmid,
              songid: music.songid,
              interval: music.interval,
              picUrl: `http://y.gtimg.cn/music/photo_new/T002R500x500M000${music.albummid}.jpg?max_age=2592000`
            }
            this.songs.push(song)
          }
        }
      })
    },
    _normalizeSongs () {
    }
  }
}
</script>

<style  lang="scss" scoped>
  .singer-enter-active, .singer-leave-active {
    transition: all .3s;
  }
  .singer-enter, .singer-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
