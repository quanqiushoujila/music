<template>
  <div class="player" v-if="playlist.length > 0">
    <transition name="normal">
      <div class="normal-player" v-if="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.picUrl">
        </div>
        <div class="top">
          <div class="back" @click="back"><i class="icon-back"></i></div>
          <h1 class="title">{{currentSong.songname}}</h1>
          <h2 class="subtitle">{{currentSong.singername}}</h2>
        </div>
        <div class="middle" 
          @touchstart="middleTouchStart"
          @touchmove="middleTouchMove"
          @touchend="middleTouchEnd"
         >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper">
              <div class="cd" :class="cdCls">
                <img :src="currentSong.picUrl" alt="" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="middleR">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text" 
                  ref="lyricLine"
                  v-for="(item, index) in currentLyric.lines" 
                  :class="{'current': currentLineNum === index}"
                  :index="index">{{item.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
           <span class="time time-l">{{currentInterval}}</span>
           <div class="progress-bar-wrapper">
             <progress-bar @percentChange="percentChange" :percent="percent"></progress-bar>
           </div>
           <span class="time time-r">{{songInterval}}</span>
          </div>
          <div class="operators">
            <div class="icon icon-left">
              <i :class="iconModeCls" @click="changeMode"></i>
            </div>
            <div class="icon icon-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon icon-center" :class="disableCls">
              <i :class="playingStateCls" @click="togglePlaying"></i>
            </div>
            <div class="icon icon-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon icon-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" @click="miniClick">
        <div class="icon">
          <img :src="currentSong.picUrl" alt="" height="40" width="40" :class="[playing ? 'play' : 'play paused']">
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.songname}}</h2>
          <p class="desc">{{currentSong.singername}}</p>
        </div>
        <div class="control">
          <progress-circle :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIconCls"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio autoplay 
      :src="src" 
      @error="error" 
      @canplay="canplay" 
      @ended="ended" 
      @play="ready"
      @timeupdate="timeupdate"
      ref="audio"></audio>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { getSinger, getSingerInfo, getLyric } from 'api/singer'
  import { playMode } from 'common/js/config'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import { shuffle } from 'common/js/util'
  import { playerMixin } from 'common/js/mixin'
  // import Lyric from 'common/js/lyric-parser'
  import Lyric from 'lyric-parser'
  import { Base64 } from 'js-base64'
  import Scroll from 'base/scroll/scroll'

  export default {
    name: 'player',
    mixins: [playerMixin],
    data () {
      return {
        vkey: '',
        filename: '',
        src: '',
        currentTime: 0,
        currentInterval: '00:00',
        currentMode: playMode.sequence,
        currentLineNum: 0,
        currentLyric: null,
        currentShow: 'cd',
        playingLyric: ''
      }
    },
    components: {
      ProgressBar, ProgressCircle, Scroll
    },
    created () {
      this.touch = {}
    },
    computed: {
      disableCls () {
        return this.songReady ? '' : 'disable'
      },
      modeSize () {
        return Object.keys(playMode).length
      },
      allSongSize () {
        return this.playlist.length
      },
      cdCls () {
        return this.playing ? 'play' : 'play paused'
      },
      playingStateCls () {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIconCls () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      iconModeCls () {
        return this.mode === playMode.sequence ? 'icon-sequence' : (this.mode === playMode.loop ? 'icon-loop' : 'icon-random')
      },
      songInterval () {
        const currentSong = this.currentSong
        const minute = Math.floor(currentSong.interval / 60)
        const second = currentSong.interval % 60
        // return currentSong.interval ? minute + ':' + second : '00:00'
        return currentSong.interval ? (minute >= 10 ? minute : ('0' + minute)) + ':' + (second >= 10 ? second : ('0' + second)) : '00:00'
      },
      percent () {
        return this.currentTime ? this.currentTime / this.currentSong.interval : 0
      },
      ...mapGetters([
        'singer', 'playlist', 'currentIndex', 'fullScreen', 'currentSong', 'playing', 'mode', 'sequenceList', 'songReady'
      ])
    },
    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlaying: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setMode: 'SET_MODE',
        setPlaylist: 'SET_PLAY_LIST',
        setSongReady: 'SET_SONG_READY'
      }),
      miniClick () {
        this.setFullScreen(true)
      },
      _getSingerInfo () {
        getSingerInfo(this.currentSong.songmid).then((res) => {
          let vkey = res.data.items[0].vkey
          let filename = res.data.items[0].filename
          this.src = getSinger(vkey, filename)
        })
      },
      selectSong () {
        this._getSingerInfo()
      },
      prev () {
        if (!this.songReady) {
          return
        }
        if (!this.playing) {
          this.setPlaying(true)
        }
        const audio = this.$refs.audio
        if (this.mode === playMode.loop) {
          audio.currentTime = 0
        } else {
          let currentIndex = this.currentIndex - 1 < 0 ? this.allSongSize - 1 : this.currentIndex - 1
          this.setCurrentIndex(currentIndex)
        }
        this.setSongReady(false)
      },
      next () {
        if (!this.songReady) {
          return
        }
        if (!this.playing) {
          this.setPlaying(true)
        }
        const audio = this.$refs.audio
        if (this.mode === playMode.loop) {
          audio.currentTime = 0
        } else {
          let currentIndex = this.currentIndex + 1 >= this.allSongSize ? 0 : this.currentIndex + 1
          this.setCurrentIndex(currentIndex)
        }
        this.setSongReady(false)
      },
      percentChange (percent) {
        if (!this.songReady) {
          return
        }
        const audio = this.$refs.audio
        const currentTime = Math.floor(this.currentSong.interval * percent)
        audio.currentTime = currentTime
      },
      togglePlaying () {
        if (!this.songReady) {
          return
        }
        this.setPlaying(!this.playing)
        let audio = this.$refs.audio
        this.playing ? audio.play() : audio.pause()
      },
      back () {
        this.setFullScreen(false)
      },
      changeMode () {
        const mode = (this.mode + 1) % this.modeSize
        const audio = this.$refs.audio
        this.setMode(mode)
        if (this.mode === playMode.loop) {
          audio.loop = true
        } else {
          audio.loop = false
          if (this.mode === playMode.random) {
            const shufflePlayList = shuffle(this.playlist)
            this.resetCurrentIndex(shufflePlayList)
            this.setPlaylist(shufflePlayList)
          } else if (this.mode === playMode.sequence) {
            this.resetCurrentIndex(this.sequenceList)
            this.setPlaylist(this.sequenceList)
          }
        }
      },
      selectLyric () {
        getLyric(this.currentSong.songmid).then((res) => {
          this.currentLyric = new Lyric(Base64.decode(res.lyric, this.handleLyric))
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.currentLineNum = 0
          this.playingLyric = ''
        })
      },
      handleLyric ({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.middleR.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.middleR.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      error () {
        console.log()
        this.setSongReady(true)
      },
      canplay () {
        this.setSongReady(true)
      },
      ended () {
        this.next()
      },
      ready () {},
      timeupdate (e) {
        this.currentTime = Math.floor(e.target.currentTime)
      },
      middleTouchStart (e) {
        const touch = e.touches[0]
        this.touch.initiated = true
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        this.touch.endX = touch.pageX
        this.touch.endY = touch.pageY
        const deltaX = this.touch.startX - this.touch.endX
        const deltaY = this.touch.startY - this.touch.endY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        const middleR = this.$refs.middleR
        const middleL = this.$refs.middleL
        const width = window.innerWidth
        const left = this.currentShow === 'cd' ? 0 : -width
        const offsetWidth = Math.min(0, Math.max(-width, left - deltaX))
        this.touch.percent = Math.abs(offsetWidth / width)
        middleR.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
        middleL.style.opacity = 1 - this.touch.percent
        middleR.$el.style.opacity = this.touch.percent
      },
      middleTouchEnd (e) {
        const deltaX = this.touch.startX - (this.touch.endX || this.touch.startX)
        const width = window.innerWidth
        const middleR = this.$refs.middleR
        const middleL = this.$refs.middleL
        const duration = 0.3
        let offsetWidth = 0
        let percent = 0
        let opacity = 1
        if (Math.abs(deltaX) < width * 0.1 && !this.touch.percent) {
          if (this.currentShow === 'cd') {
            offsetWidth = -width
            opacity = 1
            percent = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 0
            percent = 1
            this.currentShow = 'cd'
          }
        }

        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -width
            opacity = 1
            percent = 0
            this.currentShow = 'lyric'
          } else {
            percent = 1
            offsetWidth = 0
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            opacity = 0
            percent = 1
            this.currentShow = 'cd'
          } else {
            offsetWidth = -width
          }
        }
        middleR.$el.style.transition = `all ${duration}s`
        middleR.$el.style.opacity = opacity
        middleR.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
        middleL.style.opacity = percent
        this.touch.initiated = false
      }
    },
    watch: {
      currentSong (newVal, oldVal) {
        if (!newVal.songid) {
          return
        }
        if (newVal.songid === oldVal.songid) {
          return
        }
        this.selectLyric()
        this.selectSong()
      },
      currentTime (newVal) {
        if (newVal < 60) {
          this.currentInterval = '00:' + (newVal >= 10 ? newVal : '0' + newVal)
        } else {
          let minute = Math.floor(newVal / 60)
          let second = newVal % 60
          this.currentInterval = (minute >= 10 ? minute : ('0' + minute)) + ':' + (second >= 10 ? second : ('0' + second))
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../common/scss/variable";
  .normal-enter-active, .normal-leave-active {
    transition: all .4s;
    .top, .bottom, .cd-wrapper {
      transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }
  .normal-enter, .normal-leave-to {
    opacity: 0;
    .top {
      transform: translate3d(0, -100px, 0);
    }
    .bottom {
      transform: translate3d(0, 100px, 0);
    }
    .cd-wrapper {
      transform: translate3d(-200px, 500px, 0) scale(0);
    }
  }
  .mini-enter-active, .mini-leave-active {
    transition: all .3s;
  }
  .mini-enter, .mini-leave-to {
    transform: translate3d(0, -60px, 0)
  }
  @keyframes rotate
  {
      0% {transform: rotate(0);}
      100% {transform: rotate(360deg);}
  }
  .player {
    .normal-player {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 100;
      background-color: $color-background;
      .background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        filter: blur(20px);
        opacity: .6;
        z-index: -1;
      }
      .top {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
        .back {
          position: absolute;
          top: 0;
          left: 5px;
          .icon-back {
            display: block;
            font-size: 22px;
            padding: 9px;
            color: $color-theme;
            transform: rotate(-90deg);
          }
        }
        .title {
          width: 70%;
          text-align: center;
          margin: 0 auto;
          line-height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: rgba(255, 255, 255, .9);
          font-size: 1.1em;
        }
        .subtitle {
          line-height: 20px;
          font-size: .9em;
          text-align: center;
          color: rgba(255, 255, 255, .9);
        }
      }
      .middle {
        position: fixed;
        top: 80px;
        bottom: 170px;
        width: 100%;
        white-space: nowrap;
        .middle-l {
          width: 100%;
          height: 0;
          padding-top: 80%;
          position: relative;
          display: inline-block;
          .cd-wrapper {
            position: absolute;
            top: 0;
            left: 10%;
            width: 80%;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              &.play {
                animation: rotate 20s linear infinite;
              }
              &.paused {
                animation-play-state: paused;
              }
              .image {
                box-sizing: border-box;
                border: 10px solid rgba(255, 255, 255, .1);
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                border-radius: 50%;
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0;
            text-align: center;
            overflow: hidden;
            .playing-lyric {
              font-size: 1em;
              color: rgba(255, 255, 255, .5);
              height: 20px;
              line-height: 20px;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 150;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: 1em;
              &.current {
                color: #fff;
              }
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          padding: 10px 0;
          .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background-color: $color-text-ll;
            }
          }
        }
        .progress-wrapper {
          width: 80%;
          display: flex;
          margin: 0 auto;
          padding: 10px 0;
          .progress-bar-wrapper {
            margin-top: 5px;
            flex: 1;
          }
          .time {
            font-size: .8em;
            flex: 0 0 40px;
            width: 40px;
            line-height: 40px;
          }
          .time-l {
            text-align: left;
          }
          .time-r {
            text-align: right;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
          }
          .icon-left {
            text-align: right;
            i {
              font-size: 2em;
            }
          }
          .icon-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 2.5em;
            }
          }
          .icon-right {
            text-align: left;
            i {
              font-size: 2em;
            }
          }
        }
      }
    }
    .mini-player {
      position: fixed;
      bottom: 0;
      height: 60px;
      width: 100%;
      display: flex;
      align-items: center;
      background-color: $color-highlight-background;
      .icon {
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;
        img {
          border-radius: 50%;
          &.play {
            animation: rotate 10s linear infinite;
          }
          &.paused {
            animation-play-state: paused;
          }
        }
      }
      .text {
        display: flex;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        box-direction: normal;
        box-orient: vertical;
        flex-direction: column;
        box-pack: center;
        justify-content: center;
        .name {
          margin-bottom: 2px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 14px;
          color: #fff;
        }
        .desc {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: .8em;
          color: $color-text-d;
        }
      }
      .control {
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-playlist {
          font-size: 1.8em;
          color: $color-theme-d;
        }
        .icon-mini {
          font-size: 32px;
          position: absolute;
          left: -1px;
          top: -1px;
          color: $color-theme-d;
        }
      }
    }
  }
</style>
