<template>
  <div>
    <form
      id="sample-url-container"
      @submit.prevent="fetchSampleData">
      <div class="field">
        <label
          for="sample-url"
          class="label">
          Data URL
        </label>
        <div class="field has-addons">
          <div class="control is-expanded">
            <input
              id="endpoint-template"
              v-model="endpointTemplate"
              type="url"
              class="input"
              placeholder="https://..."
              required>
          </div>
          <div class="control">
            <button
              type="submit"
              class="button is-info">
              Configure
            </button>
          </div>
        </div>
        <p class="help">
          The URL should return JSON data that you'll use
          in your email template.
          <a @click.prevent="useExampleUrl">
            Try an example
          </a>
        </p>
      </div>
    </form>

    <b-loading
      :active="isLoading"
      :is-full-page="false" />

    <form
      v-if="!isLoading && sampleData"
      @submit.prevent="$emit('submit')">
      <div class="columns">
        <div
          id="sample-data-container"
          class="column">
          <label class="label">
            Data URL response
          </label>
          <pre
            id="sample-data"
            v-text="sampleData" />
        </div>
        <div
          id="template-container"
          class="column">
          <div class="field">
            <label
              for="subject-template"
              class="label">
              Email subject
            </label>
            <div class="control">
              <codemirror
                id="subject-template"
                v-model="subjectTemplate"
                :options="codemirrorOpts" />
            </div>
          </div>
          <div class="field">
            <label
              for="body-template"
              class="label">
              Email body
            </label>
            <div class="control">
              <codemirror
                id="body-template"
                v-model="bodyTemplate"
                :options="codemirrorOpts" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 class="title is-4">
          Preview
        </h4>
        <RenderedTemplate
          id="subject-preview"
          :data="sampleData"
          :template="subjectTemplate" />
        <RenderedTemplate
          id="body-preview"
          :data="sampleData"
          :template="bodyTemplate" />
      </div>
      <button
        type="submit"
        class="button is-large is-info">
        {{ submitLabel }}
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

import RenderedTemplate from '@/components/RenderedTemplate'
import * as templates from '@/helpers/templates'
import { mapNestedFields } from '@/helpers/util'

export default {
  components: {
    RenderedTemplate
  },
  props: {
    value: {
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
      codemirrorOpts: {
        mode: { name: 'handlebars', base: 'text/html' },
        tabSize: 2,
        autoRefresh: true
      }
    }
  },
  computed: {
    digest: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit('input', newVal)
      }
    },
    ...mapNestedFields('digest', {
      endpointTemplate: 'endpointTemplate',
      subjectTemplate: 'subjectTemplate',
      bodyTemplate: 'bodyTemplate'
    })
  },
  methods: {
    async fetchSampleData () {
      try {
        this.isLoading = true
        const response = await axios.get(this.endpointTemplate)
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
      // this is convoluted because $emit is async
      this.digest = {
        ...this.digest,
        endpointTemplate: templates.exampleEndpointTemplate(),
        subjectTemplate: templates.exampleSubjectTemplate(),
        bodyTemplate: templates.exampleBodyTemplate()
      }
      window.setTimeout(() => {
        this.fetchSampleData()
      }, 100)
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
