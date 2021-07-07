// 获取随机模式播放列表
export function shuffle(arr) {
	let _arr = arr.slice()
	for (let i = 0; i < arr.length; i++) {
		let j = getRandomInt(0, i)
		let t = _arr[i]
		_arr[i] = _arr[j]
		_arr[j] = t
	}
	return _arr
}

// 获取max和min之间的一个数，并且这个数在min和max之间
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

// 省流
export function debounce (func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}