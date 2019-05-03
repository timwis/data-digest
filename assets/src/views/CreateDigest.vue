<template lang="pug">
  section.section
    .container
      Steps(:current='step' @change='goToStep($event)')
      DigestTemplate(
        v-if="step == 'template'"
        :digest='digest'
        submit-label='Next step'
        @submit='onSubmitTemplate'
      )
      DigestSettings(
        v-else-if="step == 'settings'"
        :digest='digest'
        :submit-label='finalSubmitLabel'
        @submit='onFinalSubmit'
      )
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

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
  data () {
    return {
      isLoading: false,
      digest: {
        name: '',
        endpointTemplate: '',
        subjectTemplate: '',
        bodyTemplate: ''
      }
    }
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => !!state.currentUser.email,
      draftDigest: (state) => state.draftDigest
    }),
    finalSubmitLabel () {
      return this.isLoggedIn ? 'Save' : 'Login & Save'
    }
  },
  async created () {
    if (this.draftDigest) {
      Object.assign(this.digest, this.draftDigest)
      this.create()
    }
  },
  methods: {
    ...mapActions([
      'createDigest'
    ]),
    ...mapMutations({
      setDraftDigest: 'SET_DRAFT_DIGEST',
      resetDraftDigest: 'RESET_DRAFT_DIGEST'
    }),
    goToStep (step) {
      this.$router.push(`/digests/create/${step}`)
    },
    onSubmitTemplate (formData) {
      Object.assign(this.digest, formData)
      this.goToStep('settings')
    },
    async onFinalSubmit (formData) {
      Object.assign(this.digest, formData)

      if (this.isLoggedIn) {
        this.create()
      } else {
        this.setDraftDigest(this.digest)
        this.$router.push('/login')
      }
    },
    async create () {
      try {
        this.isLoading = true
        const newDigest = await this.createDigest(this.digest)
        this.resetDraftDigest()
        this.$router.push(`/digests/${newDigest.id}`)
      } catch (err) {
        this.$toast.open({
          message: err.message,
          type: 'is-danger'
        })
        console.error(err)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
