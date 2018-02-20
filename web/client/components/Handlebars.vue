<template lang="pug">
  div.content(v-html='html')
</template>

<script>
import * as handlebars from 'handlebars'

export default {
  props: {
    template: String,
    sampleData: Object
  },
  computed: {
    html () {
      if (!this.template || !this.sampleData) return ''
      try {
        const compiledTemplate = handlebars.compile(this.template)
        return compiledTemplate({ data: this.sampleData })
      } catch (err) {
        return err.message
      }
    }
  }
}
</script>

