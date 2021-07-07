<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li @click="selectItem(item)" class="item" v-for="(item, index) in topList" :key="index">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" alt="" />
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList" :key="index">
              <span>{{ index + 1 }}</span>
              <span>{{ song.songname }}-{{ song.singername }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {
    mapMutations
  } from 'vuex'
  import {
    getTopList
  } from 'api/rank'
  import {
    playlistMixin
  } from 'assets/js/mixin'
  // import {
  //   mixin
  // } from 'vue/types/umd'

  export default {
    mixins: [playlistMixin],
    components: {
      Scroll,
      Loading
    },
    data() {
      return {
        topList: []
      }
    },
		created() {
			this._getTopList()
		},
    methods: {
      ...mapMutations({
				setTopList: 'SET_TOPLIST'
			}),
      _getTopList() {
        getTopList().then(res => {
          if (res.code === 0) {
            this.topList = res.data.topList
          }
        })
      },
      // 出现mini播放器时，处理轮播部分的高度
      handlePlaylist(playlisy) {
        const bottom = playlisy.length > 0 ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.toplist.refresh()
      },
			selectItem(item) {
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item)
      }
    }
  }

</script>

<style scoped lang="less">
  @import '../../assets/css/variable';
  @import '../../assets/css/mixin';

  .rank {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;

    .toplist {
      height: 100%;
      overflow: hidden;

      .item {
        display: flex;
        margin: 0 20px;
        padding-top: 20px;
        height: 100px;

        &:last-child {
          padding-bottom: 20px;
        }

        .icon {
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
        }

        .songlist {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 20px;
          height: 100px;
          overflow: hidden;
          background: @color-highlight-background;
          color: @color-text-d;
          font-size: @font-size-small;

          .song {
            .no-wrap();
            line-height: 26px;
          }
        }
      }

      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

</style>
