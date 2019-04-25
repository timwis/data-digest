<template>
  <div class="steps">
    <div
      v-for="(step, index) in $options.steps"
      :key="index"
      class="step-item"
      :class="{
        'is-active': current == (index + 1),
        'is-completed': current > (index + 1)
      }">
      <div class="step-marker">
        <FontAwesomeIcon
          v-if="current > (index + 1)"
          icon="check" />
      </div>
      <div class="step-details">
        <p class="step-title">
          <a
            v-if="current > (index + 1)"
            @click.prevent="$emit('change', index + 1)">
            {{ step. title }}
          </a>
          <span v-else>
            {{ step.title }}
          </span>
        </p>
        <p>{{ step.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    current: {
      type: Number,
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

<style lang="sass" scoped>
a
  color: inherit
</style>
