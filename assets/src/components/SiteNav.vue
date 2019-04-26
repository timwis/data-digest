<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link
        to="/"
        class="navbar-item">
        Data Digest
      </router-link>

      <a
        role="button"
        class="navbar-burger burger"
        :class="{'is-active': isExpanded}"
        aria-label="menu"
        aria-expanded="false"
        @click="isExpanded = !isExpanded">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>

    <div
      class="navbar-menu"
      :class="{'is-active': isExpanded}">
      <div class="navbar-start">
        <router-link
          to="/"
          class="navbar-item">
          Home
        </router-link>

        <router-link
          v-if="isLoggedIn"
          to="/digests"
          class="navbar-item">
          Digests
        </router-link>
      </div>

      <div class="navbar-end">
        <div
          v-if="isLoggedIn"
          class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            {{ currentUser.email }}
          </a>
          <div class="navbar-dropdown">
            <a
              class="navbar-item"
              @click.prevent="logoutAndRedirectHome">
              Logout
            </a>
          </div>
        </div>

        <div
          v-else
          class="navbar-item">
          <div class="buttons">
            <router-link
              to="/login"
              class="button is-primary">
              <strong>Sign up</strong>
            </router-link>
            <router-link
              to="/login"
              class="button is-light">
              Log in
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
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
