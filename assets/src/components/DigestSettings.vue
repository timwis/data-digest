<template>
  <div>
    <form @submit="$emit('submit')">
      <b-field
        label="Digest name"
        label-for="name">
        <b-input
          id="name"
          v-model="name"
          placeholder="Daily updates"
          required />
      </b-field>
      <b-field
        label="Frequency"
        label-for="frequency">
        <div class="control">
          <label class="radio">
            <input
              name="frequency"
              type="radio"
              value="daily"
              checked>
            Daily
          </label>
          <label class="radio">
            <input
              name="frequency"
              type="radio"
              value="other"
              disabled>
            Other (coming soon)
          </label>
        </div>
      </b-field>
      <button
        type="submit"
        class="button is-large is-info">
        {{ submitLabel }}
      </button>
    </form>
  </div>
</template>

<script>
import { mapNestedFields } from '@/helpers/util'

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    submitLabel: {
      type: String,
      default: 'Save'
    }
  },
  computed: {
    digest: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit('input', newVal)
      }
    },
    ...mapNestedFields('digest', {
      name: 'name'
    })
  }
}
</script>

<style lang="sass" scoped>
button[type=submit]
  margin-top: 15px
</style>
