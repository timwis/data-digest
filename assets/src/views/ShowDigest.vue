<template lang="pug">
  section.section
    .container
      b-loading(:active='isLoading')

      .tabs
        ul
          li(
            v-for='tab in $options.tabs'
            :key='tab.key'
            :class="{'is-active': activeTab === tab.key}")
            RouterLink(:to='`/digests/${id}/${tab.key}`')
              | {{ tab.label }}

      div(v-if="activeTab === 'template'")
        DigestTemplate(
          v-if='digest.id'
          :digest='digest'
          @submit='onSubmit'
        )
      div(v-else-if="activeTab === 'settings'")
        DigestSettings(
          v-if='digest.id'
          :digest='digest'
          @submit='onSubmit'
        )

        button#delete-btn.button.is-danger.is-medium(@click='onClickDelete')
          | Delete Digest

      div(v-else-if="activeTab === 'subscribers'")
        DigestSubscriberList(
          v-if="digestSubscriberList"
          :subscriber-list="digestSubscriberList"
          @create='onClickCreateSubscriber'
          @delete='onClickDeleteMultipleSubscribers'
        )
</template>

<script>
import { mapState, mapActions } from 'vuex'

import DigestTemplate from '@/components/DigestTemplate'
import DigestSettings from '@/components/DigestSettings'
import DigestSubscriberList from '@/components/DigestSubscriberList'

export default {
  components: {
    DigestTemplate,
    DigestSettings,
    DigestSubscriberList
  },
  props: {
    id: {
      type: String,
      required: true
    },
    activeTab: {
      type: String,
      default: 'settings'
    }
  },
  tabs: [
    { key: 'template', label: 'Template' },
    { key: 'settings', label: 'Settings' },
    { key: 'subscribers', label: 'Subscribers' }
  ],
  data () {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      digest: (state) => state.digest,
      digestSubscriberList: (state) => state.digestSubscriberList
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
      'deleteDigest',
      'listDigestSubscribers',
      'createDigestSubscriber',
      'deleteMultipleDigestSubscribers'
    ]),
    async fetch () {
      try {
        this.isLoading = true
        await Promise.all([
          this.showDigest(this.id),
          this.listDigestSubscribers(this.id)
        ])
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
    },
    async onClickCreateSubscriber (formData) {
      try {
        this.isLoading = true
        await this.createDigestSubscriber({ digestId: this.id, subscriber: formData })
        this.$toast.open({
          message: 'Subscriber created',
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
    async onClickDeleteMultipleSubscribers (subscriberIdList) {
      try {
        this.isLoading = true
        await this.deleteMultipleDigestSubscribers({ digestId: this.id, subscriberIdList })
        const subject = (subscriberIdList.length > 1) ? 'Subscribers' : 'Subscriber'
        this.$toast.open({
          message: `${subject} deleted`,
          type: 'is-success'
        })
      } catch (err) {
        this.$toast.open({
          message: err.message,
          type: 'is-error'
        })
        console.error(err)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
#delete-btn
  margin-top: 30px
</style>
