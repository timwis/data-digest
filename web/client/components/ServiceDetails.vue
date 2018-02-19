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
      label.label(for='endpoint') URL validation
      div.control
        input.input(
          id='endpoint'
          type='text'
          :value='endpoint'
          required
        )
        p.help Your users can subscribe to any URL that passes this regex validation.

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

