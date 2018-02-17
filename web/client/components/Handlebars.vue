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
      if (!this.template || !this.sampleData) return 'no'
      try {
        const compiledTemplate = handlebars.compile(this.template)
        return compiledTemplate({ data: this.sampleData })
      } catch (err) {
        console.log('caught')
        return err.message
      }
    }
  }
}
</script>

