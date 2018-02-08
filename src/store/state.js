import { playMode } from 'common/js/config'

const state = {
  singer: {},
  mode: playMode.sequence,
  fullScreen: false,
  playing: false,
  currentIndex: -1,
  playlist: [],
  sequenceList: []
}

export default state
