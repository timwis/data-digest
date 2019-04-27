<template>
  <section class="section">
    <div class="container">
      <Steps
        :current="step"
        @change="goToStep($event)" />
      <DigestTemplate
        v-if="step == 'template'"
        v-model="digest"
        submit-label="Next step"
        @submit="goToStep('settings')" />
      <DigestSettings
        v-else-if="step == 'settings'"
        v-model="digest"
        :submit-label="finalSubmitLabel"
        @submit="onFinalSubmit" />
    </div>
  </section>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
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
  props: {
    step: {
      type: String,
      default: 'template'
    }
  },
  computed: {
    ...mapFields({
      digest: 'digest'
    }),
    ...mapState({
      isLoggedIn: (state) => !!state.currentUser.email,
      isDigestPendingCreation: (state) => state.isDigestPendingCreation
    }),
    finalSubmitLabel () {
      return this.isLoggedIn ? 'Save' : 'Login & Save'
    }
  },
  async created () {
    if (this.isDigestPendingCreation) {
      await this.createDigest()
      await this.setDigestPendingCreation(false)
      this.$router.push(`/digests/${this.digest.id}`)
    }
  },
  methods: {
    ...mapActions([
      'createDigest'
    ]),
    ...mapMutations({
      setDigestPendingCreation: 'SET_DIGEST_PENDING_CREATION'
    }),
    goToStep (step) {
      this.$router.push(`/digests/create/${step}`)
    },
    async onFinalSubmit () {
      if (this.isLoggedIn) {
        await this.createDigest()
        this.$router.push(`/digests/${this.digest.id}`)
      } else {
        this.setDigestPendingCreation(true)
        this.$router.push('/login')
      }
    }
  }
}
</script>
