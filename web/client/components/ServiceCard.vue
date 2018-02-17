<template lang="pug">
  div.column.is-4
    div.card
      div.card-content
        h1.title.is-4 {{ name }}
      footer.card-footer
        nuxt-link.card-footer-item(:to='href') View service
</template>

<script>
export default {
  props: {
    slug: {
      type: String
    },
    name: {
      type: String
    }
  },
  computed: {
    href () {
      return `/services/${this.slug}`
    }
  }
}
</script>
