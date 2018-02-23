import { mapMutations, mapGetters } from 'vuex'
import { getSinger, getSingerInfo } from 'api/singer'

export const songmixin = {
  computed: {
    ...mapGetters([
      'currentSong'
    ])
  },
  methods: {
    ...mapMutations({
      'setCurrentSongUrl': 'SET_CURRENT_SONG_URL'
    }),
    getSingerUrl () {
      getSingerInfo(this.currentSong.songmid).then((res) => {
        let vkey = res.data.items[0].vkey
        let filename = res.data.items[0].filename
        let audioUrl = getSinger(vkey, filename)
        this.setCurrentSongUrl(audioUrl)
      })
    }
  }
}
