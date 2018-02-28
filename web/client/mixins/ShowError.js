const IS_CLIENT = (process.server === false)

export default {
  methods: {
    async showError (message) {
      if (IS_CLIENT) {
        this.$snackbar.open({
          message: message || 'Something went wrong',
          type: 'is-danger',
          position: 'is-top'
        })
      }
    }
  }
}
