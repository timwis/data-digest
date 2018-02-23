<template lang="pug">
  nav.navbar(
    role='navigation'
    aria-label='main navigation'
  )
    div.navbar-brand
      nuxt-link.navbar-item(to='/') subscribeme
      div.navbar-burger(
        :class="{'is-active': isExpanded}"
        @click='isExpanded = !isExpanded'
      )
        span
        span
        span

    div.navbar-menu(:class="{'is-active': isExpanded}")
      div.navbar-start
        nuxt-link.navbar-item(to='/') Home

      div.navbar-end
        // If logged in
        div.navbar-item.has-dropdown.is-hoverable(
          v-if='user.nickname'
        )
          a.navbar-link {{ user.nickname }}
          div.navbar-dropdown
            nuxt-link.navbar-item(to='/logout') Logout

        // If not logged in
        nuxt-link.navbar-item(
          v-else
          to='/login'
        ) Login
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isExpanded: false
    }
  }
}
</script>
