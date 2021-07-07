<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    getMusicList
  } from 'api/rank'
  import {
    createSong,
    processSongsUrl
  } from 'assets/js/song'
	import MusicList from 'components/musiclist/musiclist'

  export default {
		components: {
			MusicList
		},
    data() {
      return {
        songs: [],
				rank: true
      }
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
				if (!this.toplist.id) {
					this.$router.push('/rank')
					return
				}
        getMusicList(this.toplist.id).then(res => {
          if (res.code === 0) {
            processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
              this.songs = songs
            })
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(musicData => {
          if (musicData.data.songid && musicData.data.albumid) {
            ret.push(createSong(musicData.data))
          }
        })
        return ret
      }
    },
    computed: {
      ...mapGetters([
        'toplist'
      ]),
			title() {
				return this.toplist.title
			},
			bgImage() {
				if (this.songs.length) {
					return this.songs[0].image
				}
				return ''
			}
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
