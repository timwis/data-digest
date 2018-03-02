<template lang="pug">
  div
    form(@submit.prevent='onSubmit')
      b-field
        b-input#email(
          expanded
          type='email'
          required
          placeholder='Email'
          v-model='newSubscriber.email'
        )
        b-input#url(
          expanded
          type='url'
          required
          placeholder='URL'
          v-model='newSubscriber.url'
        )
        p.control
          button.button.is-info(type='submit') Add subscriber

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
  data () {
    return {
      newSubscriber: {
        email: '',
        url: ''
      }
    }
  },
  methods: {
    onSubmit (event) {
      this.$emit('add', this.newSubscriber)
      this.newSubscriber.email = ''
      this.newSubscriber.url = ''
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
