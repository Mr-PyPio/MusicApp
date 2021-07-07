<template>
  <scroll ref="suggest" class="suggest" :data="result" :pullup="pullup" :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>
<script>
  import NoResult from 'base/noResult/noResult'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {
    search
  } from 'api/search'
  import {
    createSong,
    processSongsUrl
  } from 'assets/js/song'
  import Singer from 'assets/js/singer'
  import {
    mapActions,
    mapMutations
  } from 'vuex'

  const TYPE_SINGER = 'singer'
  const perpage = 20
  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        result: [],
        pullup: true,
        hasMore: false,
        page: 1,
        beforeScroll: true
      }
    },
    methods: {
      refresh() {
        this.$refs.suggest.refresh()
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === 0) {
            this._genResult(res.data).then(result => {
              this.result = this.result.concat(result)
            })
            this._checkMore(res.data)
          }
        })
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select', item)
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      listScroll() {
        this.$emit('listScroll')
      },
      _search(query) {
        this.page = 1
        this.hasMore = true
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === 0) {
            this._genResult(res.data).then(result => {
              this.result = result
            })
            this._checkMore(res.data)
          }
        })
      },
      _genResult(data) {
        let ret = []
        // 如果有直达歌手数据
        if (data.zhida && data.zhida.singerid && this.page === 1) {
          ret.push({
            ...data.zhida,
            ...{
              type: TYPE_SINGER
            }
          })
        }
        return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
          ret = ret.concat(songs)
          return ret
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(musicData => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
          this.hasMore = false
        }
      },
      ...mapActions([
        'insertSong'
      ]),
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      NoResult,
      Scroll,
      Loading
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          return
        }
        this._search(newQuery)
      }
    }
  }

</script>
<style scoped lang="less">
  @import '../../assets/css/variable';
  @import '../../assets/css/mixin';

  .suggest {
    height: 100%;
    overflow: hidden;

    .suggest-list {
      padding: 0 30px;

      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 30px;
        width: 30px;

        [class^='icon-'] {
          font-size: 14px;
          color: @color-text-d;
        }
      }

      .name {
        flex: 1;
        font-size: @font-size-medium;
        color: @color-text-d;
        overflow: hidden;

        .text {
          .no-wrap();
        }
      }
    }

    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }

</style>
