<template lang="pug">
  form(@submit.prevent='onSubmit')
    div.columns
      div.column
        h4.title.is-4 URL response
        pre#sample-data {{ sampleData }}
      div.column
        h4.title.is-4 Template
        no-ssr
          codemirror#template(
            v-model='template'
            :options='codemirrorOpts'
          )
    div
      h4.title.is-4 Preview
      Handlebars#preview(
        :sample-data='sampleData'
        :template='template'
      )
    button.button.is-large.is-info(
      type='submit'
    ) Next!
</template>

<script>
import Handlebars from '~/components/Handlebars'
const defaultTemplate = `{{#if data.rows.length}}
  <h1>Your daily results</h1>
  <ul>
  {{#each data.rows}}
    <li>{{title}}</li>
  {{/each}}
  </ul>
{{/if}}`

export default {
  props: [ 'url', 'currentTemplate' ],
  data () {
    return {
      sampleData: null,
      codemirrorOpts: {
        mode: { name: 'handlebars', base: 'text/html' },
        tabSize: 2
      },
      template: this.currentTemplate || defaultTemplate
    }
  },
  methods: {
    async fetchSampleData () {
      const response = await fetch(this.url)
      this.sampleData = await response.json()
    },
    onSubmit (event) {
      if (this.template.length > 0) {
        this.$emit('submit', this.template)
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
#sample-data
  width: 400px
  height: 250px
  overflow: auto

#template
  height: 250px

.CodeMirror
  height: 250px
  border: 1px #ddd solid

#preview
  height: 250px
  border: 1px #ddd solid
  margin-bottom: 25px
  overflow: auto
</style>
