<template>
  <section class="section">
    <div class="container">
      <div class="padded">
        <router-link
          to="/digests/create"
          class="button">
          Add Digest
        </router-link>
      </div>
      <div class="columns is-multiline">
        <div
          v-for="digest in digestList"
          :key="digest.id"
          class="column is-4">
          <div class="card">
            <div class="card-content">
              <h1 class="title is-4">
                {{ digest.name }}
              </h1>
            </div>
            <footer class="card-footer">
              <RouterLink
                :to="`/digests/${digest.id}`"
                class="card-footer-item">
                View Digest
              </RouterLink>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </section>
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
