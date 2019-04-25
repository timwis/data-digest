<template>
  <section class="section">
    <div class="container">
      <Steps
        :current="step"
        @change="step = $event" />
      <DigestTemplate
        v-if="step == 1"
        v-model="digest"
        submit-label="Next step"
        @submit="step = 2" />
      <DigestSettings
        v-else-if="step == 2"
        v-model="digest"
        :submit-label="finalSubmitLabel"
        @submit="onFinalSubmit" />
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import Steps from '@/components/Steps'
import DigestTemplate from '@/components/DigestTemplate'
import DigestSettings from '@/components/DigestSettings'

export default {
  components: {
    Steps,
    DigestTemplate,
    DigestSettings
  },
  data () {
    return {
      step: 1
    }
  },
  computed: {
    ...mapFields({
      digest: 'digest'
    }),
    ...mapState({
      isLoggedIn: (state) => !!state.user.email
    }),
    finalSubmitLabel () {
      return this.isLoggedIn ? 'Save' : 'Login & Save'
    }
  },
  methods: {
    onFinalSubmit () {
      console.log('saving', this.digest)
    }
  }
}
</script>

