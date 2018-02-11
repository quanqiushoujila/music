<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(item, index) of songs" :key="index" @click="selectSong(item)">
        <div class="content">
          <h2 class="name">{{item.musicData.songname}}</h2>
          <p class="desc">{{getDesc(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// import { getSingerInfo } from 'api/singer'
// import { ERR_OK } from 'api/config'
// import { mapGetters } from 'vuex'

export default {
  name: '',
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      vkey: '',
      filename: ''
    }
  },
  methods: {
    getDesc (item) {
      return `${item.musicData.singer[0].name}-${item.musicData.albumname}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../common/scss/variable";
@import "../../common/scss/mixin";
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px;
      text-align: center;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0 {
          @include bg-image('first');
        }
        &.icon1 {
          @include bg-image('second');
        }
        &.icon2 {
          @include bg-image('third');
        }
      }
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        color: $color-text;
        font-size: 1.1em;
      }
      .desc {
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
