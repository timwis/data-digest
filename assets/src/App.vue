<template>
  <div id="app">
    <SiteNav
      v-if="!disableGlobalNav"
      :user="user" />
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SiteNav from '@/components/SiteNav'

export default {
  components: {
    SiteNav
  },
  computed: {
    ...mapState({
      user: (state) => state.user
    }),
    disableGlobalNav () {
      return !!this.$route.meta.disableGlobalNav
    }
  }
}
</script>

<style lang="sass">
@import "~bulma"
//@import "~codemirror/lib/codemirror.css"
//@import "~codemirror/theme/base16-dark.css"
</style>
