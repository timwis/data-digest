<template lang="pug">
  div
    Hero(title='Service details')
    section.section
      div.container
        h2.title.is-3 {{ name }}
        b-tabs(v-model='activeTab' type='is-boxed')
          b-tab-item(label='Summary')
            ServiceSummary(
              :subjectTemplate='subjectTemplate'
              :bodyTemplate='bodyTemplate'
              :endpoint='endpoint'
            )

          b-tab-item(label='Embed')
            ServiceEmbed(:slug='slug' :endpoint='endpoint')

          b-tab-item(label='Details')
            ServiceDetails(
              :current-name='name'
              :current-endpoint='endpoint'
              submit-button='Update'
              @submit='onSubmitDetails'
            )
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Hero from '~/components/Hero'
import ServiceEmbed from '~/components/ServiceEmbed'
import ServiceSummary from '~/components/ServiceSummary'
import ServiceDetails from '~/components/ServiceDetails'

const tabs = { summary: 0, embed: 1 }

export default {
  data () {
    return {
      slug: this.$route.params.slug,
      activeTab: tabs[this.$route.query.tab] || null
    }
  },
  computed: mapState({
    name: (state) => state.currentService.name,
    endpoint: (state) => state.currentService.endpoint,
    subjectTemplate: (state) => state.currentService.subjectTemplate,
    bodyTemplate: (state) => state.currentService.bodyTemplate,
    endpoint: (state) => state.currentService.endpoint
  }),
  mounted () {
    this.getService(this.slug)
  },
  methods: {
    ...mapActions([
      'getService'
    ]),
    onSubmitDetails (details) {
      console.log('received', details)
    }
  },
  components: {
    Hero,
    ServiceEmbed,
    ServiceSummary,
    ServiceDetails
  }
}
</script>
