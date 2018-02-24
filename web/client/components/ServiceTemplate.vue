<template lang="pug">
  div
    b-loading(:active='isLoading')
    form#sample-url-container(@submit.prevent='onSubmitSampleUrl')
      div.field
        label.label(for='sample-url') Data URL
        div.field.has-addons
          div.control.is-expanded
            input.input(
              type='url'
              id='sample-url'
              ref='sampleUrl'
              placeholder='https://...'
              :value='sampleUrl'
              required
            )
          div.control
            button.button.is-info(type='submit') Configure
        p.help
          | The URL should return JSON data that you'll use in your email template.
          a(@click='useExample') Try an example

    div#sample-url-error(v-if='sampleUrlError')
      label.label Data URL error
      p
        | There was an error fetching the Data URL you provided.
        | Make sure the Data URL has CORS enabled and returns JSON.
      pre {{ sampleUrlError }}

    form(v-if='sampleData' @submit.prevent='onSubmitTemplate')
      div.columns
        div.column#sample-data-container
          label.label Data URL response
          pre#sample-data {{ sampleData }}
        div.column#template-container
          div.field
            label.label(for='subjectTemplate') Email subject
            div.control
              no-ssr
                codemirror#subjectTemplate(
                  v-model='subjectTemplate'
                  :options='codemirrorOpts'
                )
          div.field
            label.label(for='bodyTemplate') Email body
            div.control
              no-ssr
                codemirror#bodyTemplate(
                  v-model='bodyTemplate'
                  :options='codemirrorOpts'
                )
      div
        h4.title.is-4 Preview
        Handlebars#subjectPreview(
          :sample-data='sampleData'
          :template='subjectTemplate'
        )
        Handlebars#bodyPreview(
          :sample-data='sampleData'
          :template='bodyTemplate'
        )
      button.button.is-large.is-info(
        type='submit'
      ) {{ submitButton }}
</template>

<script>
import axios from 'axios'
import Handlebars from '~/components/Handlebars'
import pick from 'lodash/pick'
import * as templates from '~/helpers/templates'

export default {
  props: [
    'currentSampleUrl',
    'currentSubjectTemplate',
    'currentBodyTemplate',
    'submitButton'
  ],
  data () {
    return {
      sampleData: null,
      sampleUrlError: null,
      isLoading: false,
      codemirrorOpts: {
        mode: { name: 'handlebars', base: 'text/html' },
        tabSize: 2,
        autoRefresh: true
      },
      sampleUrl: this.currentSampleUrl || '',
      subjectTemplate: this.currentSubjectTemplate || templates.defaultSubjectTemplate(),
      bodyTemplate: this.currentBodyTemplate || templates.defaultBodyTemplate()
    }
  },
  methods: {
    async fetchSampleData (url) {
      this.isLoading = true
      this.sampleUrlError = null
      this.sampleData = null
      try {
        const response = await axios.get(url)
        this.sampleData = await response.data
      } catch (err) {
        this.sampleUrlError = err.message
      } finally {
        this.isLoading = false
      }
    },
    onSubmitSampleUrl (event) {
      const sampleUrlField = this.$refs.sampleUrl
      this.sampleUrl = sampleUrlField.value
      this.fetchSampleData(this.sampleUrl)
    },
    onSubmitTemplate (event) {
      if (this.sampleUrl.length > 0 && this.bodyTemplate.length > 0 && this.subjectTemplate.length > 0) {
        const payload = pick(this, ['sampleUrl', 'subjectTemplate', 'bodyTemplate'])
        this.$emit('submit', payload)
      }
    },
    useExample () {
      this.sampleUrl = templates.exampleSampleUrl()
      this.subjectTemplate = templates.exampleSubjectTemplate()
      this.bodyTemplate = templates.exampleBodyTemplate()
      this.fetchSampleData(this.sampleUrl)
    }
  },
  mounted () {
    if (this.sampleUrl) this.fetchSampleData(this.sampleUrl)
  },
  components: {
    Handlebars
  }
}
</script>

<style lang="sass">
#sample-url-container
  padding-bottom: 25px

#sample-data-container
  overflow: auto

#sample-data
  height: 270px

@mixin border
  border: 1px #dbdbdb solid
  border-radius: 3px

.CodeMirror
  @include border

#template-container
  overflow-x: auto

#subjectTemplate
  .CodeMirror
    height: auto

#bodyTemplate
  .CodeMirror
    height: auto

#subjectPreview
  @include border
  min-height: 36px
  max-height: 72px
  overflow: auto
  margin-bottom: 10px
  padding: 5px
  font-weight: bold

#bodyPreview
  @include border
  height: 250px
  margin-bottom: 25px
  overflow: auto
</style>
