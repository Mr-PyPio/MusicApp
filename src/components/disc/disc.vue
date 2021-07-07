<template>
	<transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import {getSongList} from 'api/recommend'
import {createSong, processSongsUrl} from 'assets/js/song'
import { mapGetters } from 'vuex'
import MusicList from 'components/musiclist/musiclist'

export default {
	computed: {
		...mapGetters([
			'disc'
		]),
		title() {
			return this.disc.dissname
		},
		bgImage() {
			return this.disc.imgurl
		}
	},
	components: {
		MusicList
	},
	data() {
		return {
			songs: []
		}
	},
	methods: {
		_getSongList() {
			if (!this.disc.dissid) {
				this.$router.push('/recommend')
				return
			}
			getSongList(this.disc.dissid).then(res => {
					if (res.code === 0) {
						processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {
            this.songs = songs
          })
					}
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
		}
	},
	created() {
		this._getSongList()
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