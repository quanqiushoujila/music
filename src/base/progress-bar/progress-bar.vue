<template>
  <div class="progress-bar" @click="progressClick" ref="progressBar">
    <div class="bar-inner" ref="bar">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
        @touchstart="progressTouchStart"
        @touchmove="progressTouchMove"
        @touchend="progressTouchEnd"
        ref="progressBtn"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16

export default {
  name: 'progressBar',
  data () {
    return {}
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  computed: {
    moveProgressBtnWidth () {
      return this.$refs.progressBar.clientWidth - progressBtnWidth
    }
  },
  created () {
    this.touch = {}
  },
  mounted () {
  },
  methods: {
    progressClick (e) {
      let offsetLeft = this.$refs.progressBar.offsetLeft
      let offsetWidth = Math.min(e.pageX - offsetLeft, this.moveProgressBtnWidth)
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      let deltaX = e.touches[0].pageX - this.touch.startX
      let offsetWidth = Math.min(this.moveProgressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd (e) {
      this.touch.initiated = false
      this._triggerPercent()
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
    },
    _triggerPercent () {
      const percent = this.$refs.progress.clientWidth / this.moveProgressBtnWidth
      this.$emit('percentChange', percent)
    }
  },
  watch: {
    percent (newVal) {
      if (!this.touch.initiated && newVal >= 0) {
        let offsetWidth = this.moveProgressBtnWidth * newVal
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../common/scss/variable";
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background-color: $color-background-d;
      .progress {
        height: 100%;
        width: 0;
        position: absolute;
        background-color: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid #fff;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
