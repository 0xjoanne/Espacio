import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import Result from '../views/Result'
import Details from '../views/Details'

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
      path: '/details',
      component: Details
    }
  ]
})
