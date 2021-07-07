import Vue from 'vue'
import Router from 'vue-router'

// 按需引入--组件懒加载
const Recommend = () => import('components/recommend/recommend')
const Singer = () => import('components/singer/singer')
const Rank = () => import('components/rank/rank')
const Search = () => import('components/search/search')
const SingerDetail = () => import('components/singerDetail/singerDetail')
const Disc = () => import('components/disc/disc')
const TopList = () => import('components/toplist/toplist')
const UserCenter = () => import('components/userCenter/userCenter')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':topID',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
