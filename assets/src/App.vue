<template>
  <div id="app">
    <SiteNav
      v-if="!disableGlobalNav"
      :current-user="currentUser" />
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SiteNav from '@/components/SiteNav'

export default {
  components: {
    SiteNav
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.currentUser
    }),
    disableGlobalNav () {
      return !!this.$route.meta.disableGlobalNav
    }
  }
}
</script>

<style lang="sass">
@import "~bulma"
@import "~bulma-steps/src/sass/index"
@import "~buefy/dist/buefy.css"
@import "~codemirror/lib/codemirror.css"
@import "~codemirror/theme/base16-dark.css"
</style>
