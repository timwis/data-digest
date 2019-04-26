import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import CreateDigest from './views/CreateDigest'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { disableGlobalNav: true }
    },
    {
      path: '/digests/create/:step?',
      name: 'createDigest',
      component: CreateDigest,
      props: true
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter (to, from, next) {
        const query = (from.path) ? `?redirect=${from.path}` : ''
        window.location.href = `/auth/auth0/${query}`
      }
    }
  ]
})
