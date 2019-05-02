<template>
  <div>
    <form @submit.prevent="$emit('submit', form)">
      <b-field
        label="Digest name"
        label-for="name">
        <b-input
          id="name"
          v-model="form.name"
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
import pick from 'lodash/pick'

export default {
  props: {
    digest: {
      type: Object,
      required: true
    },
    submitLabel: {
      type: String,
      default: 'Save'
    }
  },
  data () {
    return {
      form: pick(this.digest, ['name'])
    }
  }
}
</script>

<style lang="sass" scoped>
button[type=submit]
  margin-top: 15px
</style>
