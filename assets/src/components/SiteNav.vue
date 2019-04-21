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
          to="/digests">
          Digests
        </router-link>
      </div>

      <div class="navbar-end">
        <div
          v-if="isLoggedIn"
          class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            {{ user.email }}
          </a>
          <div class="navbar-dropdown">
            <router-link
              to="/logout"
              class="navbar-item">
              Logout
            </router-link>
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
  },
  computed: {
    isLoggedIn () {
      return !!this.user.email
    }
  }
}
</script>
