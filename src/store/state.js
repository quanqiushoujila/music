import { playMode } from 'common/js/config'

const state = {
  singer: {},
  mode: playMode.sequence,
  fullScreen: false,
  playing: false,
  currentIndex: -1,
  playlist: [],
  sequenceList: [],
  currentSong: {},
  currentSongSequenceIndex: -1,
  songReady: false
}

export default state
