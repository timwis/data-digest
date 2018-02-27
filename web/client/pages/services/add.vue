<template lang="pug">
  div
    Hero(title='Add service')
    section.section
      div.container
        Steps(:current='step' @select='onSelectStep')

        ServiceTemplate(
          v-if='step === 1'
          :current-sample-url='payload.sampleUrl'
          :current-subject-template='payload.subjectTemplate'
          :current-body-template='payload.bodyTemplate'
          submit-button='Next'
          @submit='onSubmitTemplate'
        )
        ServiceDetails(
          v-if='step === 2'
          :sample-url='payload.sampleUrl'
          :current-name='payload.name'
          :current-endpoint='payload.endpoint'
          submit-button='Create'
          @submit='onSubmitDetails'
        )
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import pick from 'lodash/pick'

import initiateLogin from '~/helpers/auth0'
import Hero from '~/components/Hero'
import Steps from '~/components/Steps'
import ServiceTemplate from '~/components/ServiceTemplate'
import ServiceDetails from '~/components/ServiceDetails'
import ShowError from '~/mixins/ShowError'

export default {
  mixins: [ ShowError ],
  data () {
    return {
      step: 1,
      payload: {
        sampleUrl: null,
        subjectTemplate: null,
        bodyTemplate: null,
        name: null,
        endpoint: null
      }
    }
  },
  computed: mapGetters([
    'isLoggedIn'
  ]),
  methods: {
    ...mapActions([
      'createService',
      'stashDraftService',
      'removeStashedDraftService',
      'loadStashedDraftService'
    ]),
    onSelectStep (newStep) {
      this.step = newStep
    },
    async onSubmitTemplate (templates) {
      Object.assign(this.payload, templates)
      this.step = 2
    },
    async onSubmitDetails (details) {
      Object.assign(this.payload, details)
      this.step = 3

      if (this.isLoggedIn) {
        try {
          const service = await this.createService(this.payload)
          this.redirectToService(service.slug)
        } catch (err) {
          this.step = 2
          this.showError('Something went wrong creating the service')
        }
      } else {
        await this.stashDraftService(this.payload)
        initiateLogin({ redirect: 'addService' })
      }
    },
    redirectToService (slug) {
      this.$router.push(`/services/${slug}?tab=embed`)
    }
  },
  async created () {
    if (this.isLoggedIn) {
      const draft = await this.loadStashedDraftService()
      if (draft) {
        this.step = 3
        this.removeStashedDraftService()
        try {
          const service = await this.createService(draft)
          this.redirectToService(service.slug)
        } catch (err) {
          this.step = 1
          this.showError('Something went wrong creating the service')
        }
      }
    }
  },
  components: {
    Hero,
    Steps,
    ServiceTemplate,
    ServiceDetails
  }
}
</script>
