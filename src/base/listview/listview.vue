<template>
  <scroll 
    @scroll="scroll"
    class="listview" 
    ref="listview"
    :listen-scroll="listenScroll"
    :probe-type="probeType"
    :data="data">
    <ul>
      <li class="list-group" 
        v-for="(group, index) in data" 
        :key="index"
        ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" 
            v-for="item in group.items" 
            :key="item.id"
            @click="selectItem(item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item" 
          v-for="(item, index) of shortcutList" 
          :key="index" 
          :data-index="index"
          :class="{current: currentIndex === index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/js/dom'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  name: 'list-view',
  components: { Scroll, Loading },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      currentIndex: 0,
      listenScroll: true,
      scrollY: 0,
      diff: -1
    }
  },
  computed: {
    shortcutList () {
      return this.data.map((item) => {
        return item.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  created () {
    this.listHeight = []
    this.touch = {}
    this.probeType = 3
    this.scroll()
  },
  methods: {
    selectItem (item) {
      this.$emit('selectSinger', item)
    },
    onShortcutTouchStart (e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = +anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) + this.touch.anchorIndex
      this._scrollTo(delta)
    },
    scroll (pos) {
      this.scrollY = pos ? pos.y : 0
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      }
      if (this.listHeight.length - 2 < index) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight () {
      this.listHeight = []
      let height = 0
      this.listHeight.push(height)
      this.$refs.listGroup.forEach((item, index) => {
        height += item.clientHeight
        this.listHeight.push(height)
      })
    }
  },
  watch: {
    scrollY (newVal, oldVal) {
      let scrollY = -newVal
      let listHeight = this.listHeight
      if (newVal > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0, len = listHeight.length - 1; i < len; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (height1 <= scrollY && height2 > scrollY) {
          this.currentIndex = i
          this.diff = height2 - scrollY
          return
        }
      }
      this.currentIndex = listHeight.length - 2
    },
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  }
}
</script>

<style  lang="scss" scoped>
  @import '../../common/scss/variable';
  .listview{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;
    .list-group {
      padding-bottom: 30px;
      .list-group-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
      .list-group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar{
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name{
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
    .list-shortcut {
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: $color-background-d;
      font-family: Helvetica;
      .item {
        padding: 3px;
        line-height: 1;
        color: $color-text-l;
        font-size: $font-size-small;
        &.current{
          color: $color-theme;
        }
      }
    }
    .list-fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
