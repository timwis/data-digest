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
              id="sample-url"
              v-model="sampleUrl"
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

    <form
      v-if="sampleData"
      @submit.prevent="$emit('submit')">
      <div class="columns">
        <div
          id="sample-data-container"
          class="column">
          <label class="label">
            Data URL response
          </label>
          <pre id="sample-data">
            {{ sampleData }}
          </pre>
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
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

import * as templates from '@/helpers/templates'
import { mapNestedFields } from '@/helpers/util'

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
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
      sampleUrl: 'sampleUrl',
      subjectTemplate: 'subjectTemplate',
      bodyTemplate: 'bodyTemplate'
    })
  },
  methods: {
    async fetchSampleData () {
      try {
        const response = await axios.get(this.sampleUrl)
        this.sampleData = response.data
      } catch (err) {
        console.error(err)
      } finally {

      }
    },
    useExampleUrl () {
      this.digest = Object.assign({}, this.digest, {
        sampleUrl: templates.exampleSampleUrl(),
        subjectTemplate: templates.exampleSubjectTemplate(),
        bodyTemplate: templates.exampleBodyTemplate()
      })
      this.fetchSampleData()
    }
  }
}
</script>
