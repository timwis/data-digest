<template lang="pug">
  div
    label(for='endpoint') URL validation
    pre#endpoint {{ endpoint }}

    label(for='subject-template') Subject template
    pre#subject-template {{ subjectTemplate }}

    label(for='body-template') Body template
    pre#body-template {{ bodyTemplate }}
</template>

<script>
export default {
  props: [
    'subjectTemplate',
    'bodyTemplate',
    'endpoint'
  ]
}
</script>

<style lang="sass" scoped>
pre
  margin: 10px 0
  max-height: 350px
  overflow: auto
</style>

