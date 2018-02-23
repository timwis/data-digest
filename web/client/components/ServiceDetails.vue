<template lang="pug">
  form(@submit.prevent='onSubmit')
    b-field(
      label='Service name'
      label-for='name'
      message='What would you call this subscription?'
    )
      b-input(
        id='name'
        placeholder='e.g. Listings'
        :value='currentName'
        required
      )

    b-field(
      label='URL validation'
      label-for='endpoint'
      message='Your users can subscribe to any URL that passes this regex validation.'
    )
      b-input(
        id='endpoint'
        :value='endpoint'
        required
      )

    button.button.is-large.is-info(
      type='submit'
    ) {{ submitButton }}
</template>

<script>
import getFormData from 'get-form-data'

export default {
  props: [
    'url',
    'currentName',
    'currentEndpoint',
    'submitButton'
  ],
  computed: {
    endpoint () {
      return this.currentEndpoint || (this.url ? escapeRegex(this.url) : '')
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

