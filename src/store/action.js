import * as types from './mutation-type'
import {playMode} from 'assets/js/config'
import { shuffle } from '../assets/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'assets/js/cache.js'

// 查找song在list中的索引
function findIndex(list, song) {
	return list.findIndex(item => {
		return item.id === song.id
	})
}
// 处理播放操作
export const selectPlay = function({commit, state}, {list, index}) {
	commit(types.SET_SEQUENCE_LIST, list)
	// 如果播放模式是随机模式
	if (state.mode === playMode.random) {
		let randomlist = shuffle(list)
		commit(types.SET_PLAYLIST, randomlist)
		index = findIndex(randomlist, list[index])
	} else {
			commit(types.SET_PLAYLIST, list)
	}
	// 设置播放歌曲的索引
	commit(types.SET_CURRENT_INDEX, index)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function({commit}, {list}) {
	commit(types.SET_PLAY_MODE, playMode.random)
	commit(types.SET_SEQUENCE_LIST, list)
	let randomlist = shuffle(list)
	commit(types.SET_PLAYLIST, randomlist)
	commit(types.SET_CURRENT_INDEX, 0)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function({commit, state}, song) {
	let playlist = state.playlist.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	// 记录当前歌曲
	let currentSong = playlist[currentIndex]
	// 查找当前列表中是否有待插入的歌曲并返回索引
	let fdindex = findIndex(playlist, song)
	// 因为插入歌曲，所以索引+1
	currentIndex++
	// 插入这首歌到当前索引位置
	playlist.splice(currentIndex, 0, song)
	if (fdindex > -1) {
		if (currentIndex > fdindex) {
			playlist.splice(fdindex, 1)
			currentIndex--
		} else {
			playlist.splice(fdindex + 1, 1)
		}
	}
	let currentSIndex = findIndex(sequenceList, currentSong) + 1
	let fsIndex = findIndex(sequenceList, song)
	sequenceList.splice(currentIndex, 0, song)
	if (fsIndex > -1) {
		if (currentSIndex > fsIndex) {
			sequenceList.splice(fsIndex, 1)
		} else {
			sequenceList.splice(fsIndex + 1, 1)
		}
	}
	commit(types.SET_PLAYLIST, playlist)
	commit(types.SET_SEQUENCE_LIST, sequenceList)
	commit(types.SET_CURRENT_INDEX, currentIndex)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function({commit}, query) {
	commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({commit}, query) {
	commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function({commit}) {
	commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function({commit, state}, song) {
	let playlist = state.playlist.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex

	let pIndex = findIndex(playlist, song)
	playlist.splice(pIndex, 1)
	let sIndex = findIndex(sequenceList, song)
	sequenceList.splice(sIndex, 1)

	if (currentIndex > pIndex || currentIndex === playlist.length) {
		currentIndex--
	}

	commit(types.SET_PLAYLIST, playlist)
	commit(types.SET_SEQUENCE_LIST, sequenceList)
	commit(types.SET_CURRENT_INDEX, currentIndex)

	if (!playlist.length) {
		commit(types.SET_PLAYING_STATE, false)
	} else {
		commit(types.SET_PLAYING_STATE, true)
	}
}

export const deleteSongList = function({commit}) {
	commit(types.SET_PLAYLIST, [])
	commit(types.SET_SEQUENCE_LIST, [])
	commit(types.SET_CURRENT_INDEX, -1)
	commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function({commit}, song) {
	commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteSong = function({commit}, song) {
	commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteSong = function({commit}, song) {
	commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}