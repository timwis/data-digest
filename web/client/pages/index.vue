<template lang="pug">
  section.hero.is-info.is-fullheight
    div.hero-head
      site-nav(:user='user')
    div.hero-body
      div.container
        h1.title SubscribeMe
        h2.subtitle Monitors an API for new data and sends digest emails to subscribers.

        nuxt-link.button.is-link(
          v-if='user.nickname'
          to='/services'
        ) Get started
        nuxt-link.button.is-link(
          v-else
          to='/login'
        ) Get started
</template>


<script>
import { mapState } from 'vuex'
import SiteNav from '~/components/SiteNav'

export default {
  layout: 'no-nav',
  components: {
    SiteNav
  },
  computed: mapState({
    user: (state) => state.user
  })
}
</script>
