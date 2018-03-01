<template lang="pug">
  div
    form(@submit.prevent='onSubmit')
      h4.title.is-4 Add subscriber
      
      b-field(label='Email' label-for='email')
        b-input#email(type='email' required)

      b-field(label='URL' label-for='url')
        b-input#url(type='url' required placeholder='https://...')

      button.button.is-info(type='submit') Add subscriber

    h4.title.is-4 Subscribers
    b-table(:data='subscribers' striped)
      template(slot-scope='props')
        b-table-column(field='email' label='Email') {{ props.row.email }}
        b-table-column(field='createdAt' label='Date') {{ props.row.createdAt | formatDate }}
        b-table-column(field='queryUrl' label='URL') {{ props.row.queryUrl }}
</template>

<script>
import getFormData from 'get-form-data'
import formatDate from 'date-fns/format'

export default {
  props: ['subscribers'],
  methods: {
    onSubmit (event) {
      const formData = getFormData(event.target)
      this.$emit('add', formData)
    }
  },
  filters: {
    formatDate (timestamp) {
      const date = new Date(timestamp)
      return formatDate(date, 'YYYY-MM-DD')
    }
  }
}
</script>

