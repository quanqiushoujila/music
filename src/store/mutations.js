import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER] (state, val) {
    state.singer = val
  },
  [types.SET_MODE] (state, val) {
    state.mode = val
  },
  [types.SET_FULL_SCREEN] (state, val) {
    state.fullScreen = val
  },
  [types.SET_PLAYING_STATE] (state, val) {
    state.playing = val
  },
  [types.SET_CURRENT_INDEX] (state, val) {
    state.currentIndex = val
  },
  [types.SET_PLAY_LIST] (state, val) {
    state.playlist = val
  },
  [types.SET_SEQUENCE_LIST] (state, val) {
    state.sequenceList = val
  },
  [types.SET_SONG_READY] (state, val) {
    state.songReady = val
  },
  [types.SET_CURRENT_SONG_SEQUENCE_INDEX] (state, val) {
    state.currentSongSequenceIndex = val
  }
}

export default mutations
