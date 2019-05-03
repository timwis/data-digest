<template lang="pug">
  nav.navbar(role='navigation' aria-label='main navigation')
    .navbar-brand
      RouterLink.navbar-item(to='/')
        | Data Digest
      a.navbar-burger.burger(
        role='button'
        :class="{'is-active': isExpanded}"
        aria-label='menu'
        aria-expanded='false'
        @click='isExpanded = !isExpanded'
      )
        span(aria-hidden='true')
        span(aria-hidden='true')
        span(aria-hidden='true')

    .navbar-menu(:class="{'is-active': isExpanded}")
      .navbar-start
        RouterLink.navbar-item(
          to='/'
        ) Home
        RouterLink.navbar-item(
          v-if='isLoggedIn'
          to='/digests'
        ) Digests

      .navbar-end
        .navbar-item.has-dropdown.is-hoverable(v-if='isLoggedIn')
          a.navbar-link
            | {{ currentUser.email }}
          .navbar-dropdown
            a.navbar-item(@click.prevent='logoutAndRedirectHome')
              | Logout
        .navbar-item(v-else='')
          .buttons
            RouterLink.button.is-primary(to='/login')
              strong Sign up
            RouterLink.button.is-light(to='/login')
              | Log in
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    currentUser: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isExpanded: false
    }
  },
  computed: {
    isLoggedIn () {
      return !!this.currentUser.email
    }
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
    async logoutAndRedirectHome () {
      await this.logout()
      this.$router.push('/')
    }
  }
}
</script>
