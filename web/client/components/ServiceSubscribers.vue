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
    b-table(
      :data='subscribers'
      striped
      default-sort='createdAt'
      default-sort-direction='desc'
    )
      template(slot-scope='props')
        b-table-column(width=25)
          button.button.is-small(@click='$emit(`delete`, props.row.id)')
            icon(name='close')
        b-table-column(field='email' label='Email' sortable)
          | {{ props.row.email }}
        b-table-column(field='createdAt' label='Date' width=120 sortable)
          | {{ props.row.createdAt | formatDate }}
        b-table-column.url(field='queryUrl' label='URL' sortable)
          | {{ props.row.queryUrl }}
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

<style lang="sass" scoped>
.url
  overflow-wrap: break-word
  word-wrap: break-word
  word-break: break-word
</style>
