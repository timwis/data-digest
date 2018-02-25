<template lang="pug">
  section.section
    div.container Redirecting to login page...
</template>

<script>
import initiateLogin from '../helpers/auth0'

export default {
  created () {
    initiateLogin({ redirect: 'index' })
  }
}
</script>
