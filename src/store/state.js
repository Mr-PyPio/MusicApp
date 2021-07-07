import { playMode } from '../assets/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'assets/js/cache'

const state = {
	// 歌手数据
	singer: {},
	// 是否播放
	playing: false,
	// 展开状态
	fullScreen: false,
	// 播放列表
	playlist: [],
	// 顺序列表
	sequenceList: [],
	mode: playMode.sequence,
	// 当前播放索引
	currentIndex: -1,
	disc: {},
	toplist: {},
	searchHistory: loadSearch(),
	// 播放历史
	playHistory: loadPlay(),
	favoriteList: loadFavorite()
}

export default state