<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll ref="shortcut" class="shortcut" :data="shortcut" :refreshDelay="refreshDelay">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotKey" :key="index">
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <div class="search-history">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest @listScroll="blurInput" @select="saveSearch" ref="suggest" :query="query"></suggest>
    </div>
    <router-view></router-view>
    <comfirm text="确认删除所有的搜索记录吗？" confirmBtnText="删除所有" @confirm="clearSearchHistory" ref="comfirm"></comfirm>
  </div>
</template>
<script>
  import SearchBox from 'base/searchBox/searchBox'
  import Scroll from 'base/scroll/scroll'
  import {
    getHotKey
  } from 'api/search'
  import SearchList from 'base/searchList/searchList'
  import Suggest from 'base/suggest/suggest'
  import {
    mapActions,
    mapGetters
  } from 'vuex'
  import Comfirm from '../../base/comfirm/comfirm.vue'
  import {
    playlistMixin
  } from 'assets/js/mixin'

  export default {
    mixins: [playlistMixin],
    components: {
      SearchBox,
      Scroll,
      SearchList,
      Suggest,
      Comfirm
    },
    data() {
      return {
        hotKey: [],
        query: '',
				refreshDelay: 100
      }
    },
    computed: {
			shortcut() {
				return this.hotKey.concat(this.searchHistory)
			},
      ...mapGetters([
				'searchHistory'
				])
    },
    methods: {
      _getHotKey() {
        getHotKey().then(res => {
          if (res.code === 0) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      addQuery(query) {
        this.$refs.searchBox.setQuery(query)
      },
      onQueryChange(query) {
        this.query = query
      },
      // 滚动列表收起键盘
      blurInput() {
        this.$refs.searchBox.blur()
      },
      saveSearch(item) {
        this.saveSearchHistory(this.query)
      },
			showConfirm() {
				this.$refs.comfirm.show()
			},
			handlePlaylist(playlisy) {
        const bottom = playlisy.length > 0 ? '60px' : ''
        this.$refs.shortcutWrapper.style.bottom = bottom
				this.$refs.searchResult.style.bottom = bottom
        this.$refs.shortcut.refresh()
				this.$refs.suggest.refresh()
      },
      ...mapActions([
        'saveSearchHistory',
				'deleteSearchHistory',
				'clearSearchHistory'
      ])
    },
    created() {
      this._getHotKey()
    },
		watch: {
			query(newQuery) {
				if (!newQuery) {
					setTimeout(() => {
						this.$refs.shortcut.refresh()
					}, 200)
				}
			}
		}
  }

</script>
<style lang="less" scoped>
  @import '../../assets/css/variable';
  @import '../../assets/css/mixin';

  .search {
    .search-box-wrapper {
      margin: 20px;
    }

    .shortcut-wrapper {
      position: fixed;
      top: 178px;
      bottom: 0;
      width: 100%;

      .shortcut {
        height: 100%;
        overflow: hidden;

        .hot-key {
          margin: 0 20px 20px 20px;

          .title {
            margin-bottom: 20px;
            font-size: @font-size-medium;
            color: @color-text-l;
          }

          .item {
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: @color-highlight-background;
            font-size: @font-size-medium;
            color: @color-text-d;
          }
        }

        .search-history {
          position: relative;
          margin: 0 20px;

          .title {
            display: flex;
            align-items: center;
            height: 40px;
            font-size: @font-size-medium;
            color: @color-text-l;

            .text {
              flex: 1;
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
      }
    }

    .search-result {
      position: fixed;
      width: 100%;
      top: 178px;
      bottom: 0;
    }
  }

</style>
