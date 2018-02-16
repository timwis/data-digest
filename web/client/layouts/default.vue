<template lang="pug">
  div
    site-nav(:user='user')
    nuxt
</template>

<script>
import { mapState } from 'vuex'
import SiteNav from '~/components/SiteNav'

export default {
  computed: mapState({
    user: (state) => state.user
  }),
  components: {
    SiteNav
  }
}
</script>
