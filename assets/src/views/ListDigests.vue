<template lang="pug">
  section.section
    .container
      .padded
        router-link.button(to='/digests/create')
          | Add Digest
      .columns.is-multiline
        .column.is-4(
          v-for='digest in digestList'
          :key='digest.id'
        )
          .card
            .card-content
              h1.title.is-4
                | {{ digest.name }}
            footer.card-footer
              RouterLink.card-footer-item(
                :to='`/digests/${digest.id}`'
              ) View Digest
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      digestList: (state) => state.digestList
    })
  },
  created () {
    this.fetch()
  },
  methods: {
    ...mapActions([
      'listDigests'
    ]),
    async fetch () {
      try {
        this.isLoading = true
        await this.listDigests()
      } catch (err) {
        this.$toast.open({
          message: err.message,
          type: 'is-danger'
        })
        console.error(err)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.padded
  padding-bottom: 25px
</style>
