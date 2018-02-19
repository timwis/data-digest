<template lang="pug">
  div
    Hero(:title='this.name || `Service detail`')
    section.section
      div.container
        ServiceEmbed(:slug='slug' :endpoint='endpoint')
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Hero from '~/components/Hero'
import ServiceEmbed from '~/components/ServiceEmbed'

export default {
  data () {
    return {
      slug: this.$route.params.slug
    }
  },
  computed: mapState({
    name: (state) => state.currentService.name,
    endpoint: (state) => state.currentService.endpoint
  }),
  mounted () {
    this.getService(this.slug)
  },
  methods: mapActions([
    'getService'
  ]),
  components: {
    Hero,
    ServiceEmbed
  }
}
</script>
