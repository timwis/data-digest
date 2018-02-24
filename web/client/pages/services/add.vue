<template lang="pug">
  div
    Hero(title='Add service')
    section.section
      div.container
        Steps(:current='step' @select='onSelectStep')

        ServiceTemplate(
          v-if='step === 1'
          :current-sample-url='sampleUrl'
          :current-subject-template='subjectTemplate'
          :current-body-template='bodyTemplate'
          submit-button='Next'
          @submit='onSubmitTemplate'
        )
        ServiceDetails(
          v-if='step === 2'
          :sample-url='sampleUrl'
          :current-name='name'
          :current-endpoint='endpoint'
          submit-button='Create'
          @submit='onSubmitDetails'
        )
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import pick from 'lodash/pick'

import Hero from '~/components/Hero'
import Steps from '~/components/Steps'
import ServiceTemplate from '~/components/ServiceTemplate'
import ServiceDetails from '~/components/ServiceDetails'
import ServiceEmbed from '~/components/ServiceEmbed'

export default {
  data () {
    return {
      step: 1
    }
  },
  computed: mapState('draftService', [
    'sampleUrl',
    'subjectTemplate',
    'bodyTemplate',
    'name',
    'endpoint'
  ]),
  methods: {
    ...mapMutations('draftService', {
      setDraftTemplates: 'SET_TEMPLATES',
      setDraftDetails: 'SET_DETAILS',
      resetDraft: 'RESET'
    }),
    ...mapActions([
      'createService'
    ]),
    onSubmitTemplate (templates) {
      this.setDraftTemplates(templates)
      this.step = 2
    },
    onSelectStep (newStep) {
      this.step = newStep
    },
    async onSubmitDetails (details) {
      this.setDraftDetails(details)
      this.step = 3

      const payload = pick(this, [
        'name',
        'sampleUrl',
        'subjectTemplate',
        'bodyTemplate',
        'endpoint'
      ])
      const service = await this.createService(payload)
      this.$router.push(`/services/${service.slug}?tab=embed`)
    }
  },
  components: {
    Hero,
    Steps,
    ServiceTemplate,
    ServiceDetails,
    ServiceEmbed
  }
}
</script>
