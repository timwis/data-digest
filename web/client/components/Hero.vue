<template lang="pug">
  section.hero.is-info
    div.hero-body
      div.container
        h1.title {{ title }}
        h2.subtitle(v-if='subtitle') {{ subtitle }}
</template>

<script>
export default {
  props: [ 'title', 'subtitle' ]
}
</script>
