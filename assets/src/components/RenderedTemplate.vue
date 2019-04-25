<template>
  <div
    class="content"
    v-html="html" /> <!-- eslint-disable-line vue/no-v-html -->
</template>

<script>
import Liquid from 'liquidjs'

const liquidEngine = new Liquid()

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    template: {
      type: String,
      required: true
    }
  },
  asyncComputed: {
    async html () {
      try {
        return await liquidEngine.parseAndRender(this.template, { data: this.data })
      } catch (err) {
        return err.message
      }
    }
  }
}
</script>
