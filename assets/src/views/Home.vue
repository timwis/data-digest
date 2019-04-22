<template>
  <section class="hero is-info is-fullheight">
    <div class="hero-head">
      <SiteNav :user="user" />
    </div>
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          Data Digest
        </h1>
        <h2 class="subtitle">
          Monitors an API for new data and sends digest emails to subscribers.
        </h2>

        <router-link
          to="/digests/create"
          class="button is-link">
          Get started
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import SiteNav from '@/components/SiteNav'

export default {
  components: {
    SiteNav
  },
  computed: mapState({
    user: (state) => state.user
  })
}
</script>
