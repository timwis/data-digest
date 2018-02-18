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
          :current-template='template'
          @submit='onSubmitTemplate'
        )
        ServiceDetails(
          v-if='step === 2'
          :url='url'
          :current-name='name'
          :current-subject-template='subjectTemplate'
          :current-endpoint='endpoint'
          @submit='onSubmitDetails'
        )
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import Hero from '~/components/Hero'
import Steps from '~/components/Steps'
import ServiceTemplate from '~/components/ServiceTemplate'
import ServiceDetails from '~/components/ServiceDetails'

export default {
  data () {
    return {
      step: 0
    }
  },
  computed: mapState({
    url: (state) => state.draftService.url,
    template: (state) => state.draftService.template,
    name: (state) => state.draftService.name,
    subjectTemplate: (state) => state.draftService.subjectTemplate,
    endpoint: (state) => state.draftService.endpoint
  }),
  methods: {
    ...mapMutations('draftService', {
      setDraftUrl: 'SET_URL',
      setDraftTemplate: 'SET_TEMPLATE',
      setDraftDetails: 'SET_DETAILS',
      resetDraft: 'RESET'
    }),
    onSubmitUrl (event) {
      const urlField = event.currentTarget.url
      this.resetDraft()
      this.setDraftUrl(urlField.value)
      this.step = 1
    },
    onSubmitTemplate (template) {
      this.setDraftTemplate(template)
      this.step = 2
    },
    onSelectStep (newStep) {
      this.step = newStep
    },
    onSubmitDetails (details) {
      this.setDraftDetails(details)
      this.step = 3
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

<style lang="sass" scoped>
.url-container
  padding-bottom: 25px
</style>
