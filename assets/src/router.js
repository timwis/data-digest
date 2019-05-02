import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import CreateDigest from '@/views/CreateDigest'
import ShowDigest from '@/views/ShowDigest'

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
      path: '/digests/:id',
      name: 'showDigest',
      component: ShowDigest,
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