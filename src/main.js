/* eslint-disable import/first */
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import App from './App'
import router from './router'
import vueLazyload from 'vue-lazyload'
import fastclick from 'fastclick'
import store from './store'
import 'babel-polyfill'

import 'assets/css/reset.css'
import 'assets/css/icon.css'

fastclick.attach(document.body)

Vue.use(vueLazyload, {
	loading: require('assets/image/loading.gif')
})

// import cVonsole from 'vconsole'

Vue.config.productionTip = false

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
	store,
	fastclick,
  render: h => h(App)
})
