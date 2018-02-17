<template lang="pug">
  section.section
    div.container Redirecting to login page...
</template>

<script>
import { auth0Url } from '../helpers/auth0'

export default {
  created () {
    if (typeof window !== 'undefined') {
      window.location.href = auth0Url
    }
  }
}
</script>
