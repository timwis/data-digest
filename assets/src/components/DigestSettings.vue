<template lang="pug">
  div
    form(@submit.prevent="$emit('submit', form)")
      b-field(label='Digest name' label-for='name')
        b-input#name(
          v-model='form.name'
          placeholder='Daily updates'
          required=''
        )
      b-field(label='Frequency' label-for='frequency')
        .control
          label.radio
            input(
              name='frequency'
              type='radio'
              value='daily'
              checked
            )
            |  Daily
          label.radio
            input(
              name='frequency'
              type='radio'
              value='other'
              disabled=''
            )
            |  Other (coming soon)
      button.button.is-large.is-info(type='submit')
        | {{ submitLabel }}
</template>

<script>
import pick from 'lodash/pick'

export default {
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
      form: pick(this.digest, ['name'])
    }
  }
}
</script>

<style lang="sass" scoped>
button[type=submit]
  margin-top: 15px
</style>
