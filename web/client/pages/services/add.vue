<template lang="pug">
  div
    Hero(title='Add service')
    section.section
      div.container

        form.url-container(@submit.prevent='onSubmitUrl')
          div.field.is-horizontal
            div.field-label.is-normal
              label.label(for='url') Data URL
            div.field-body
              div.field.has-addons
                div.control.is-expanded
                  input.input(
                    type='url'
                    id='url'
                    placeholder='https://...'
                    :value='url'
                    required
                  )
                div.control
                  button.button.is-info(type='submit') Configure

        Steps(:current='step' @select='onSelectStep')

        ServiceTemplate(
          v-if='step === 1'
          :url='url'
          :current-subject-template='subjectTemplate'
          :current-body-template='bodyTemplate'
          @submit='onSubmitTemplate'
        )
        ServiceDetails(
          v-if='step === 2'
          :url='url'
          :current-name='name'
          :current-endpoint='endpoint'
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
      step: 0
    }
  },
  computed: mapState('draftService', [
    'url',
    'subjectTemplate',
    'bodyTemplate',
    'name',
    'endpoint'
  ]),
  methods: {
    ...mapMutations('draftService', {
      setDraftUrl: 'SET_URL',
      setDraftTemplates: 'SET_TEMPLATES',
      setDraftDetails: 'SET_DETAILS',
      resetDraft: 'RESET'
    }),
    ...mapActions([
      'createService'
    ]),
    onSubmitUrl (event) {
      const urlField = event.currentTarget.url
      this.resetDraft()
      this.setDraftUrl(urlField.value)
      this.step = 1
    },
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
        'subjectTemplate',
        'bodyTemplate',
        'endpoint'
      ])
      const service = await this.createService(payload)
      // this.$router.push(`/services/${service.slug}`)
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

<style lang="sass" scoped>
.url-container
  padding-bottom: 25px
</style>
