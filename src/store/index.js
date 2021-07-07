import Vue from 'vue'
// createLogger 打印出修改日志
import Vuex, { createLogger } from 'vuex'

import * as actions from './action'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'

Vue.use(Vuex)

// 开发时检测state修改是不是由mutations进行
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	actions,
	getters,
	state,
	mutations,
	strict: debug,
	plugins: debug ? [createLogger()] : []
})