<template lang="pug">
  form(@submit.prevent='onSubmit')
    div.field
      label.label(for='name') Service name
      div.control
        input.input(
          id='name'
          type='text'
          placeholder='e.g. Listings'
          :value='currentName'
          required
        )
        p.help What would you call this subscription?

    div.field
      label.label(for='subjectTemplate') Email subject
      div.control
        input.input(
          id='subjectTemplate'
          type='text'
          :placeholder="'e.g. You have {{ data.rows.length }} listings today'"
          :value='currentSubjectTemplate'
          required
        )
        p.help(v-html="'You can inject <code>{{ data }}</code> here too.'")

    div.field
      label.label(for='endpoint') URL validation
      div.control
        input.input(
          id='endpoint'
          type='text'
          :value='endpoint'
          required
        )
        p.help(v-html='`Use regex. Need to inject the current date? Wait until the next step; this is just validation.`')

    button.button.is-large.is-info(
      type='submit'
    ) Next
</template>

<script>
import getFormData from 'get-form-data'

export default {
  props: [
    'url',
    'currentName',
    'currentSubjectTemplate',
    'currentEndpoint'
  ],
  data () {
    return {
      endpoint: this.currentEndpoint || (this.url ? escapeRegex(this.url) : '')
    }
  },
  methods: {
    onSubmit (event) {
      const formData = getFormData(event.currentTarget)
      this.$emit('submit', formData)
    }
  }
}

function escapeRegex (url) {
  const matches = /[/|\\{}()[\]^$+*?.]/g
  return url.replace(matches, '\\$&')
}
</script>

