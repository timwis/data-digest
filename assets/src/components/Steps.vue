<template>
  <div class="steps">
    <div
      v-for="(step, index) in $options.steps"
      :key="step.key"
      class="step-item"
      :class="{
        'is-active': current == step.key,
        'is-completed': currentIndex > index
      }">
      <div class="step-marker">
        <FontAwesomeIcon
          v-if="currentIndex > index"
          icon="check" />
      </div>
      <div class="step-details">
        <p class="step-title">
          <a
            v-if="currentIndex > index"
            @click.prevent="$emit('change', step.key)">
            {{ step.title }}
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
