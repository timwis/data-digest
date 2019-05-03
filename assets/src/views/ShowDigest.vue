<template lang="pug">
  section.section
    .container
      b-loading(:active='isLoading')
      b-tabs(v-model='activeTab')
        b-tab-item(label='Template')
          DigestTemplate(
            v-if='digest.id'
            :digest='digest'
            @submit='onSubmit'
          )
        b-tab-item(label='Settings')
          DigestSettings(
            v-if='digest.id'
            :digest='digest'
            @submit='onSubmit'
          )

          button#delete-btn.button.is-danger.is-medium(@click='onClickDelete')
            | Delete Digest
</template>

<script>
import { mapState, mapActions } from 'vuex'

import DigestTemplate from '@/components/DigestTemplate'
import DigestSettings from '@/components/DigestSettings'

export default {
  components: {
    DigestTemplate,
    DigestSettings
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      activeTab: 0
    }
  },
  computed: {
    ...mapState({
      digest: (state) => state.digest
    })
  },
  watch: {
    id: 'fetch'
  },
  created () {
    this.fetch()
  },
  methods: {
    ...mapActions([
      'showDigest',
      'patchDigest',
      'deleteDigest'
    ]),
    async fetch () {
      try {
        this.isLoading = true
        await this.showDigest(this.id)
      } catch (err) {
        this.$toast.open({
          message: err.message,
          type: 'is-danger'
        })
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    async onSubmit (formData) {
      try {
        this.isLoading = true
        await this.patchDigest({ id: this.id, payload: formData })
        this.$toast.open({
          message: 'Digest updated',
          type: 'is-success'
        })
      } catch (err) {
        this.$toast.open({
          message: err.message,
          type: 'is-danger'
        })
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    async onClickDelete () {
      this.$dialog.confirm({
        title: 'Delete this Digest',
        message: `Are you sure you want to delete <b>${this.digest.name}</b>? This action cannot be undone.`,
        confirmText: 'Delete Digest',
        type: 'is-danger',
        onConfirm: async () => {
          try {
            this.isLoading = true
            await this.deleteDigest(this.id)
            this.$toast.open({
              message: 'Digest deleted',
              type: 'is-success'
            })
            this.$router.push('/digests')
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
      })
    }
  }
}
</script>

<style lang="sass" scoped>
#delete-btn
  margin-top: 30px
</style>
