<template lang="pug">
  form(@submit.prevent='onSubmit')
    div.columns
      div.column#sample-data-container
        h4.title.is-4 URL response
        pre#sample-data {{ sampleData }}
      div.column#template-container
        h4.title.is-4 Template
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
    ) Next
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
  props: [ 'url', 'currentSubjectTemplate', 'currentBodyTemplate' ],
  data () {
    return {
      sampleData: null,
      codemirrorOpts: {
        mode: { name: 'handlebars', base: 'text/html' },
        tabSize: 2
      },
      subjectTemplate: this.currentSubjectTemplate || defaultSubjectTemplate,
      bodyTemplate: this.currentBodyTemplate || defaultBodyTemplate
    }
  },
  methods: {
    async fetchSampleData () {
      const response = await fetch(this.url)
      this.sampleData = await response.json()
    },
    onSubmit (event) {
      if (this.bodyTemplate.length > 0 && this.subjectTemplate.length > 0) {
        const payload = pick(this, ['subjectTemplate', 'bodyTemplate'])
        this.$emit('submit', payload)
      }
    }
  },
  mounted () {
    this.fetchSampleData()
  },
  watch: {
    url (newValue, oldValue) {
      console.log('url changed', newValue)
      this.fetchSampleData()
    }
  },
  components: {
    Handlebars
  }
}
</script>

<style lang="sass">
#sample-data-container
  overflow: auto

#sample-data
  height: 360px

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
