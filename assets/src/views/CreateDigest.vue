<template>
  <div>
    <DigestTemplate v-model="digest" />
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

import DigestTemplate from '@/components/DigestTemplate'

export default {
  components: {
    DigestTemplate
  },
  computed: {
    ...mapFields({
      digest: 'digest'
    })
  }
}
</script>

