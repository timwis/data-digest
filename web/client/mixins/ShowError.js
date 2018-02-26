export default {
  methods: {
    async showError (message) {
      this.$snackbar.open({
        message: message || 'Something went wrong',
        type: 'is-danger',
        position: 'is-top'
      })
    }
  }
}
