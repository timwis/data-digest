<template>
  <div>Redirecting to login page...</div>
</template>

<script>
import { auth0Url } from '../helpers/auth0'

export default {
  created () {
    window.location.href = auth0Url
  }
}
</script>
