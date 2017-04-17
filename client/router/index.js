import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import Result from '../views/Result'
import Detail from '../views/Detail'
import Direction from '../views/Direction'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/result',
      component: Result
    },
    {
      path: '/detail',
      component: Detail
    },
    {
      path: '/direction',
      component: Direction
    }
  ]
})
