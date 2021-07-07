<template>
	<transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/musiclist/musiclist'
import {mapGetters} from 'vuex'
import {getSongDetail} from 'api/singer'
import {createSong, processSongsUrl} from 'assets/js/song'

export default {
	components: {
		MusicList
	},
	data() {
		return {
			songs: []
		}
	},
	computed: {
		title() {
			return this.singer.name
		},
		bgImage() {
			return this.singer.avatar
		},
		...mapGetters([
			'singer'
		])
	},
	methods: {
		_getSongDetail() {
			// 歌手歌单刷新页面，跳转回歌手列表页面
			if (!this.singer.id) {
				this.$router.push('/singer')
				return
			}
			// 获取歌手的歌单数据
			getSongDetail(this.singer.id).then(res => {
				if (res.code === 0) {
					processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
            this.songs = songs
          })
				}
			})
		},
		// 处理数据成简易的数据列表
		_normalizeSongs(list) {
			let ret = []
			list.forEach(item => {
				let {musicData} = item
				if (musicData.songid && musicData.albummid) {
					ret.push(createSong(musicData))
				}
			})
			return ret
		}
	},
	created() {
		this._getSongDetail()
	}
}
</script>

<style lang="less" scoped>

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>