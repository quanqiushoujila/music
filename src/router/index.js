import Vue from 'vue'
import Router from 'vue-router'
import Search from 'pages/search/search'
import Singer from 'pages/singer/singer'
import Recommend from 'pages/recommend/recommend'
import Rank from 'pages/rank/rank'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/singer',
      component: Singer
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/rank',
      component: Rank
    }
  ]
})
