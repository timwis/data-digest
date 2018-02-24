<template lang="pug">
  div
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

    form(v-if='sampleUrl' @submit.prevent='onSubmitTemplate')
      div.columns
        div.column#sample-data-container
          label.label Data URL response
          pre#sample-data {{ sampleData }}
          b-loading(:active='isLoading')
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
import { stripIndent } from 'common-tags'
import Handlebars from '~/components/Handlebars'
import pick from 'lodash/pick'

const defaultSubjectTemplate = `You have {{ data.rows.length }} listings today`
const defaultBodyTemplate = stripIndent`
  {{#if data.rows.length}}
    <h1>Your daily listings</h1>
    <ul>
    {{#each data.rows}}
      <li>{{title}}</li>
    {{/each}}
    </ul>
  {{/if}}`

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
      isLoading: false,
      codemirrorOpts: {
        mode: { name: 'handlebars', base: 'text/html' },
        tabSize: 2,
        autoRefresh: true
      },
      sampleUrl: this.currentSampleUrl || '',
      subjectTemplate: this.currentSubjectTemplate || defaultSubjectTemplate,
      bodyTemplate: this.currentBodyTemplate || defaultBodyTemplate
    }
  },
  methods: {
    async fetchSampleData () {
      this.isLoading = true
      const response = await fetch(this.sampleUrl)
      this.sampleData = await response.json()
      this.isLoading = false
    },
    onSubmitSampleUrl (event) {
      const sampleUrlField = this.$refs.sampleUrl
      this.sampleUrl = sampleUrlField.value
    },
    onSubmitTemplate (event) {
      if (this.sampleUrl.length > 0 && this.bodyTemplate.length > 0 && this.subjectTemplate.length > 0) {
        const payload = pick(this, ['sampleUrl', 'subjectTemplate', 'bodyTemplate'])
        this.$emit('submit', payload)
      }
    }
  },
  mounted () {
    if (this.sampleUrl) this.fetchSampleData()
  },
  watch: {
    sampleUrl (newValue, oldValue) {
      this.fetchSampleData()
    }
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
