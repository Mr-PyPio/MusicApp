<template>
  <transition name="list-fade">
    <div class="playlist" @click="hide" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{ modeText }}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll ref="listContent" :data="sequenceList" class="list-content" :refreshDelay="refreshDelay">
          <transition-group ref="list" name="list" tag="ul">
            <li :key="item.id" class="item" v-for="(item, index) in sequenceList" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text" v-html="item.name"></span>
              <span @click.stop="toggleFavorite(item)" class="like">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span @click.stop="deleteOne(item)" class="delete">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div @click="addSong" class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/comfirm/comfirm'
  import {
    mapGetters,
    mapMutations,
    mapActions
  } from 'vuex'
  import {
    playMode
  } from 'assets/js/config'
  import {
    shuffle
  } from 'assets/js/util'
  import AddSong from 'components/addSong/addsong'

  export default {
    data() {
      return {
        showFlag: false,
				refreshDelay: 100
      }
    },
    methods: {
      show() {
        this.showFlag = true
        // 等待dom元素获取完成
        setTimeout(() => {
          this.$refs.listContent.refresh()
          this.scrollToCurrent(this.currentSong)
        }, 200)
      },
      scrollToCurrent(current) {
        const index = this.sequenceList.findIndex((song) => {
          return current.id === song.id
        })
        this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
      },
      selectItem(item, index) {
        if (this.mode === playMode.random) {
          index = this.playList.findIndex((song) => {
            return item.id === song.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayState(true)
      },
      hide() {
        this.showFlag = false
      },
      getCurrentIcon(item) {
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        }
        return ''
      },
			// 更换播放模式
      changeMode() {
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      resetCurrentIndex(list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
			// 列表显示
      showConfirm() {
        this.$refs.confirm.show()
      },
      addSong() {
        this.$refs.addSong.show()
      },
      confirmClear() {
        this.deleteSongList()
        this.hide()
      },
      deleteOne(item) {
        if (item.deleting) {
          return
        }
        item.deleting = true
        this.deleteSong(item)
        if (!this.playlist.length) {
          this.hide()
        }
        setTimeout(() => {
          item.deleting = false
        }, 300)
      },
      toggleFavorite(item) {
        if (this.isFavorite(item)) {
          this.deleteFavoriteSong(item)
        } else {
          this.saveFavoriteSong(item)
        }
      },
      isFavorite(song) {
        const index = this.favoriteList.findIndex((item) => {
          return song.id === item.id
        })
        return index > -1
      },
      getFavoriteIcon(item) {
        if (this.isFavorite(item)) {
          return 'icon-favorite'
        }
        return 'icon-not-favorite'
      },
      ...mapMutations({
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayState: 'SET_PLAYING_STATE'
      }),
      ...mapActions([
        'deleteSong',
        'deleteSongList',
        'deleteFavoriteSong',
        'saveFavoriteSong'
      ])
    },
    computed: {
      ...mapGetters([
        'sequenceList',
        'mode',
        'currentSong',
        'playlist',
        'favoriteList'
      ]),
      iconMode() {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      },
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
  }

</script>

<style scoped lang="less">
  @import '../../assets/css/variable';
  @import '../../assets/css/mixin';

  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: @color-background-d;

    &.list-fade-enter-active,
    &.list-fade-leave-active {
      transition: opacity 0.3s;

      .list-wrapper {
        transition: all 0.3s;
      }
    }

    &.list-fade-enter,
    &.list-fade-leave-to {
      opacity: 0;

      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }

    &.list-fade-enter,
    .list-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: @color-highlight-background;

      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;

        .title {
          display: flex;
          align-items: center;

          .icon {
            margin-right: 10px;
            font-size: 30px;
            color: @color-theme-d;
          }

          .text {
            flex: 1;
            font-size: @font-size-medium;
            color: @color-text-l;
          }

          .clear {
            .extend-click();

            .icon-clear {
              font-size: @font-size-medium;
              color: @color-text-d;
            }
          }
        }
      }

      .list-content {
        max-height: 240px;
        overflow: hidden;

        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;

          &.list-enter-active,
          &.list-leave-active {
            transition: all 0.1s;
          }

          &.list-enter,
          &.list-leave-to {
            height: 0;
          }

          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: @font-size-small;
            color: @color-theme-d;
          }

          .text {
            flex: 1;
            .no-wrap();
            font-size: @font-size-medium;
            color: @color-text-d;
          }

          .like {
            .extend-click();
            margin-right: 15px;
            font-size: @font-size-small;
            color: @color-theme;

            .icon-favorite {
              color: @color-sub-theme;
            }
          }

          .delete {
            .extend-click();
            font-size: @font-size-small;
            color: @color-theme;
          }
        }
      }

      .list-operate {
        width: 140px;
        margin: 20px auto 30px auto;

        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid @color-text-l;
          border-radius: 100px;
          color: @color-text-l;

          .icon-add {
            margin-right: 5px;
            font-size: @font-size-small-s;
          }

          .text {
            font-size: @font-size-small;
          }
        }
      }

      .list-close {
        text-align: center;
        line-height: 50px;
        background: @color-background;
        font-size: @font-size-medium-x;
        color: @color-text-l;
      }
    }
  }

</style>
