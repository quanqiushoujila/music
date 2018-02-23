import * as types from './mutation-types'
import { playMode } from 'common/js/config'

export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlayBtn = ({commit, state}, {list, index, list1}) => {
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_MODE, playMode.random)
  if (list1) {
    commit(types.SET_SEQUENCE_LIST, list1)
  }
}
