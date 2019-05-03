<template lang="pug">
  .steps
    .step-item(
      v-for='(step, index) in $options.steps'
      :key='step.key'
      :class="{\
        'is-active': current == step.key,\
        'is-completed': currentIndex > index\
      }"
    )
      .step-marker
        FontAwesomeIcon(v-if='currentIndex > index' icon='check')
      .step-details
        p.step-title
          a(
            v-if='currentIndex > index'
            @click.prevent="$emit('change', step.key)"
          ) {{ step.title }}
          span(v-else='')
            | {{ step.title }}
        p {{ step.description }}
  </template>

<script>
export default {
  props: {
    current: {
      type: String,
      default: 'template'
    }
  },
  computed: {
    currentIndex () {
      return this.$options.steps.findIndex((step) => step.key === this.current)
    }
  },
  steps: [
    {
      key: 'template',
      title: 'Template',
      description: 'Configure how the data is rendered'
    },
    {
      key: 'settings',
      title: 'Settings',
      description: 'Email subject, etc.'
    }
  ]
}
</script>

<style lang="sass" scoped>
a
  color: inherit
</style>
