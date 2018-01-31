<template>
  <div class="loading">
    <img src="./loading.gif" height="40" width="40" alt="loading">
    <p class="title">{{text}}</p>
  </div>
</template>
<script>
  export default {
    name: 'loading',
    props: {
      text: {
        type: String,
        default: '正在加载中...'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../common/scss/variable";
  .loading {
    width: 100%;
    text-align: center;
    .title {
      line-height: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
    }
  }
</style>