<template lang="pug">
  div
    Hero(title='Service details')
    section.section
      div.container(v-if='isFetched')
        h2.title.is-3 {{ name }}
        b-tabs(v-model='activeTab' type='is-boxed' :animated='false')
          b-tab-item(label='Subscribers')
            ServiceSubscribers(
              :subscribers='subscribers'
              @add='onAddSubscriber'
            )

          b-tab-item(label='Embed')
            ServiceEmbed(
              :slug='slug'
              :endpoint='endpoint'
              :sample-url='sampleUrl'
            )

          b-tab-item(label='Template')
            ServiceTemplate(
              :current-sample-url='sampleUrl'
              :current-subject-template='subjectTemplate'
              :current-body-template='bodyTemplate'
              submit-button='Update'
              @submit='onSubmitEdits'
            )

          b-tab-item(label='Details')
            ServiceDetails(
              :current-name='name'
              :current-endpoint='endpoint'
              submit-button='Update'
              @submit='onSubmitEdits'
            )

          b-tab-item(label='Delete')
            button.button.is-danger(@click='onClickDelete') Delete this service
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Hero from '~/components/Hero'
import ServiceEmbed from '~/components/ServiceEmbed'
import ServiceSubscribers from '~/components/ServiceSubscribers'
import ServiceDetails from '~/components/ServiceDetails'
import ServiceTemplate from '~/components/ServiceTemplate'
import ShowError from '~/mixins/ShowError'

const tabs = { subscribers: 0, embed: 1 }

export default {
  mixins: [ ShowError ],
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
      sampleUrl: (state) => state.currentService.sampleUrl,
      subscribers: (state) => state.currentServiceSubscribers
    }),
    isFetched () {
      return this.subjectTemplate || this.bodyTemplate
    }
  },
  async created () {
    try {
      await this.getService(this.slug)
    } catch (err) {
      this.showError('Something went wrong getting this service')
    }
  },
  methods: {
    ...mapActions([
      'getService',
      'updateService',
      'deleteService',
      'addSubscriber'
    ]),
    async onSubmitEdits (payload) {
      const slug = this.slug
      try {
        const service = await this.updateService({ slug, payload })
        if (service.slug !== slug) {
          const newUrl = `/services/${service.slug}`
          this.$router.replace(newUrl)
        }
        this.activeTab = 0
      } catch (err) {
        this.showError('Something went wrong updating this service')
      }
    },
    onClickDelete () {
      this.$dialog.confirm({
        title: 'Delete this service',
        message: 'Are you sure you want to <b>delete</b> this service? This action cannot be undone.',
        confirmText: 'Delete service',
        type: 'is-danger',
        onConfirm: async () => {
          try {
            await this.deleteService(this.slug)
            this.$router.push('/services')
          } catch (err) {
            this.showError('Something went wrong deleting this service')
          }
        }
      })
    },
    async onAddSubscriber ({ email, url }) {
      try {
        const slug = this.slug
        await this.addSubscriber({ slug, email, url })
      } catch (err) {
        this.showError('Somethign went wrong adding this subscriber')
      }
    }
  },
  components: {
    Hero,
    ServiceEmbed,
    ServiceSubscribers,
    ServiceDetails,
    ServiceTemplate
  }
}
</script>
