<template lang="pug">
  section.hero.is-info.is-fullheight
    .hero-head
      SiteNav(:current-user='currentUser')
    .hero-body
      .container
        h1.title
          | Data Digest
        h2.subtitle
          | Monitors an API for new data and sends digest emails to subscribers.
        RouterLink.button.is-link(to='/digests/create')
          | Get started
</template>

<script>
import { mapState } from 'vuex'
import SiteNav from '@/components/SiteNav'

export default {
  components: {
    SiteNav
  },
  computed: mapState({
    currentUser: (state) => state.currentUser
  })
}
</script>
