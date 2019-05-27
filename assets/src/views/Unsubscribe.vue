<template lang="pug">
  section.section
    .container
      div(v-if='currentSubscriber.id')
        h2.title.is-2
          | {{ currentSubscriber.digest.name }}
        
        button.button.is-danger(@click='unsubscribeCurrentSubscriber(token)')
          | Unsubscribe {{ currentSubscriber.email }}
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    token: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState({
      currentSubscriber: (state) => state.currentSubscriber
    })
  },
  created () {
    this.getCurrentSubscriber(this.token)
  },
  methods: {
    ...mapActions([
      'getCurrentSubscriber',
      'unsubscribeCurrentSubscriber'
    ])
  }
}
</script>

