<template lang="pug">
  section.section
    div.container Logging out...
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: mapActions([
    'logout'
  ]),
  async created () {
    await this.logout()
    this.$router.push('/')
  }
}
</script>
