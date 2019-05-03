<template lang="pug">
  div
    form#sample-url-container(@submit.prevent='fetchSampleData')
      .field
        label.label(for='sample-url')
          | Data URL
        .field.has-addons
          .control.is-expanded
            input#endpoint-template.input(
              v-model='form.endpointTemplate'
              type='url'
              placeholder='https://...'
              required=''
            )
          .control
            button.button.is-info(type='submit')
              | Configure
        p.help
          | The URL should return JSON data that you&apos;ll use
          | in your email template.
          a(@click.prevent='useExampleUrl')
            |  Try an example

    b-loading(:active='isLoading' :is-full-page='false')

    form(v-if='!isLoading && sampleData' @submit.prevent="$emit('submit', form)")
      .columns
        #sample-data-container.column
          label.label
            | Data URL response
          pre#sample-data(v-text='sampleData')
        #template-container.column
          .field
            label.label(for='subject-template')
              | Email subject
            .control
              codemirror#subject-template(
                v-model='form.subjectTemplate'
                :options='$options.codemirrorOpts'
              )
          .field
            label.label(for='body-template')
              | Email body
            .control
              codemirror#body-template(
                v-model='form.bodyTemplate'
                :options='$options.codemirrorOpts'
              )
      div
        h4.title.is-4
          | Preview
        RenderedTemplate#subject-preview(
          :data='sampleData'
          :template='form.subjectTemplate'
        )
        RenderedTemplate#body-preview(
          :data='sampleData'
          :template='form.bodyTemplate'
        )
      button.button.is-large.is-info(type='submit')
        | {{ submitLabel }}
</template>

<script>
import axios from 'axios'
import pick from 'lodash/pick'

import RenderedTemplate from '@/components/RenderedTemplate'
import * as templates from '@/helpers/templates'

export default {
  components: {
    RenderedTemplate
  },
  props: {
    digest: {
      type: Object,
      required: true
    },
    submitLabel: {
      type: String,
      default: 'Save'
    }
  },
  data () {
    return {
      isLoading: false,
      sampleData: null,
      form: pick(this.digest, [
        'endpointTemplate',
        'subjectTemplate',
        'bodyTemplate'
      ])
    }
  },
  codemirrorOpts: {
    mode: { name: 'handlebars', base: 'text/html' },
    tabSize: 2,
    autoRefresh: true
  },
  created () {
    // Automatically fetch sample data from ShowDigest
    if (this.form.endpointTemplate) this.fetchSampleData()
  },
  methods: {
    async fetchSampleData () {
      try {
        this.isLoading = true
        const response = await axios.get(this.form.endpointTemplate)
        this.sampleData = response.data
      } catch (err) {
        this.$toast.open({
          message: err.message,
          type: 'is-danger'
        })
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    useExampleUrl () {
      this.form.endpointTemplate = templates.exampleEndpointTemplate()
      this.form.subjectTemplate = templates.exampleSubjectTemplate()
      this.form.bodyTemplate = templates.exampleBodyTemplate()
      this.fetchSampleData()
    }
  }
}
</script>

<style lang="sass">
#sample-url-container
  padding-bottom: 25px

#sample-data-container
  overflow: auto

#sample-data
  height: 320px

@mixin border
  border: 1px #dbdbdb solid
  border-radius: 3px

.CodeMirror
  @include border

#template-container
  overflow-x: auto

#subject-template
  .CodeMirror
    height: auto

#body-template
  .CodeMirror
    height: auto

#subject-preview
  @include border
  min-height: 36px
  max-height: 72px
  overflow: auto
  margin-bottom: 10px
  padding: 5px
  font-weight: bold

#body-preview
  @include border
  height: 250px
  margin-bottom: 25px
  overflow: auto
</style>
