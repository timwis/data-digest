<template lang="pug">
  div.steps
    div.step-item(
      v-for='(step, index) in $options.steps'
      :class="{ 'is-active': current == (index + 1), 'is-completed': current > (index + 1) }"
    )
      div.step-marker
        icon(v-if='current > (index + 1)' name='check')
      div.step-details
        p.step-title
          a(
            v-if='current > (index +1)'
            @click.prevent="$emit('select', index + 1)"
          ) {{ step.title }}
          span(v-else) {{ step.title }}
        p {{ step.description }}
</template>

<script>
export default {
  props: {
    current: {
      default: 0
    }
  },
  steps: [
    {
      title: 'Template',
      description: 'Configure how the data is rendered'
    },
    {
      title: 'Details',
      description: 'Email subject, etc.'
    }
  ]
}
</script>
