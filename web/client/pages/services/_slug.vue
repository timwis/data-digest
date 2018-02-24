<template lang="pug">
  div
    Hero(title='Service details')
    section.section
      div.container
        h2.title.is-3 {{ name }}
        b-tabs(v-model='activeTab' type='is-boxed' :animated='false')
          b-tab-item(label='Summary')
            ServiceSummary(
              :subjectTemplate='subjectTemplate'
              :bodyTemplate='bodyTemplate'
              :endpoint='endpoint'
            )

          b-tab-item(label='Embed')
            ServiceEmbed(:slug='slug' :endpoint='endpoint')

          b-tab-item(label='Template')
            ServiceTemplate(
              v-if='isFetched'
              :current-sample-url='sampleUrl'
              :current-subject-template='subjectTemplate'
              :current-body-template='bodyTemplate'
              submit-button='Update'
              @submit='onSubmitEdits'
            )

          b-tab-item(label='Details')
            ServiceDetails(
              v-if='isFetched'
              :current-name='name'
              :current-endpoint='endpoint'
              submit-button='Update'
              @submit='onSubmitEdits'
            )
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Hero from '~/components/Hero'
import ServiceEmbed from '~/components/ServiceEmbed'
import ServiceSummary from '~/components/ServiceSummary'
import ServiceDetails from '~/components/ServiceDetails'
import ServiceTemplate from '~/components/ServiceTemplate'

const tabs = { summary: 0, embed: 1 }

export default {
  data () {
    return {
      slug: this.$route.params.slug,
      activeTab: tabs[this.$route.query.tab] || null
    }
  },
  computed: {
    ...mapState({
      name: (state) => state.currentService.name,
      endpoint: (state) => state.currentService.endpoint,
      subjectTemplate: (state) => state.currentService.subjectTemplate,
      bodyTemplate: (state) => state.currentService.bodyTemplate,
      endpoint: (state) => state.currentService.endpoint,
      sampleUrl: (state) => state.currentService.sampleUrl
    }),
    isFetched () {
      return this.subjectTemplate || this.bodyTemplate
    }
  },
  created () {
    this.getService(this.slug)
  },
  methods: {
    ...mapActions([
      'getService',
      'updateService'
    ]),
    async onSubmitEdits (payload) {
      const slug = this.slug
      const service = await this.updateService({ slug, payload })
      if (service.slug !== slug) {
        const newUrl = `/services/${service.slug}`
        this.$router.replace(newUrl)
      }
      this.activeTab = 0
    }
  },
  components: {
    Hero,
    ServiceEmbed,
    ServiceSummary,
    ServiceDetails,
    ServiceTemplate
  }
}
</script>
