<template lang="pug">
  div
    Hero(title='Services')
    section.section
      div.container
        div.padded
          nuxt-link.button(to='/services/add') Add service
        div.columns.is-multiline
          service-card(
            v-for='service in services'
            :key='service.slug'
            :slug='service.slug'
            :name='service.name'
          )
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Hero from '~/components/Hero'
import ServiceCard from '~/components/ServiceCard'
import ShowError from '~/mixins/ShowError'

export default {
  mixins: [ ShowError ],
  computed: mapState({
    services: (state) => state.services
  }),
  methods: mapActions([
    'getServices'
  ]),
  async created () {
    try {
      await this.getServices()
    } catch (err) {
      this.showError('Something went wrong getting your list of services')
    }
  },
  components: {
    Hero,
    ServiceCard
  }
}
</script>

<style lang="sass" scoped>
.padded
  padding-bottom: 25px
</style>
