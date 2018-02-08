<template>
  <div class="song-list">
    {{songs}}
    <ul>
      <li class="item">
        <div class="rank" v-for="(item, index) of songs" :key="index">
          <span></span>
        </div>
        <div class="content">
          <h2 class="name">{{item.musicData.albumname}}</h2>
          <p class="desc"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  data () {
    return {}
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
      }
      .desc {
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
