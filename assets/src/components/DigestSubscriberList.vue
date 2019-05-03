<template lang="pug">
  div
    form(@submit.prevent="onSubmit")
      b-field
        b-input#email(
          v-model='form.email'
          type='email'
          placeholder='Email address'
          required
          expanded
        )
        p.control
          button.button.is-info(type='submit')
            | Add subscriber

    div(v-if='subscriberList.length > 0')
      button#delete-subscribers-btn.button.is-danger(
        :disabled='checkedRows.length === 0'
        @click='onClickDelete'
      ) Delete {{ checkedRows.length }} selected subscribers

      b-table(
        :data='subscriberList'
        :columns='$options.columns'
        checkable
        :checked-rows.sync='checkedRows'
        striped
        default-sort='insertedAt'
        default-sort-direction='desc'
      )
</template>

<script>
export default {
  props: {
    subscriberList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      form: {
        email: ''
      },
      checkedRows: []
    }
  },
  columns: [
    { field: 'email', label: 'Email', sortable: true },
    { field: 'insertedAt', label: 'Created at', sortable: true }
  ],
  methods: {
    onSubmit () {
      const formData = { email: this.form.email } // otherwise this seems to be set to '' before being pushed to the server
      this.$emit('create', formData)
      this.form.email = ''
    },
    onClickDelete () {
      const checkedRowIds = this.checkedRows.map((row) => row.id)
      this.$emit('delete', checkedRowIds)
    }
  }
}
</script>

<style lang="sass" scoped>
#delete-subscribers-btn
  margin-top: 20px
</style>
