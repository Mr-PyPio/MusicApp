<template>
  <div class="singer" ref="singer">
    <listview :data="singerList" ref="list" @select="selectSinger"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
  import {
    getSingerList
  } from 'api/singer'
  import Singer from 'assets/js/singer'
  import Listview from 'base/listview/listview'
	import {mapMutations} from 'vuex'
  import { playlistMixin } from 'assets/js/mixin'

  const HOT_NAME = '热门'
	// 限制热门歌手列表栏数量为10
  const HOT_SINGER_LEN = 10

  export default {
		mixins: [playlistMixin],
    components: {
      Listview
    },
    data() {
      return {
				// 歌手列表数据
        singerList: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      // 获取歌手数据
      _getSingerList() {
        getSingerList().then(res => {
          if (res.code === 0) {
            this.singerList = this._normalizeList(res.data.list)
          }
        })
      },
      // 整理歌手数据
      _normalizeList(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
					// 按歌手首字母拆分列表
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        // 处理map，得到有序列表
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
					// 按字母顺序排序
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
			// 处理点击歌手时间
      selectSinger(singer) {
				// 跳转到对应歌手的歌单也中
        this.$router.push({
          path: `/singer/${singer.id}`
        })
				// 将歌手数据存储在vuex中
				this.setSinger(singer)
      },
			// 处理出现mini播放器时，滚动高度刷新
			handlePlaylist(playlisy) {
				const bottom = playlisy.length > 0 ? '60px' : ''
				this.$refs.singer.style.bottom = bottom
				this.$refs.list.refresh()
			},
			...mapMutations({
				setSinger: 'SET_SINGER'
			})
    }
  }

</script>

<style>
  .singer {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }

</style>
