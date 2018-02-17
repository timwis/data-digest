<template lang="pug">
  div
    Hero(title='Add service')
    section.section
      div.container

        form.url-container(@submit.prevent='onSubmitUrl')
          div.field.is-horizontal
            div.field-label.is-normal
              label.label(for='url') Data URL
            div.field-body
              div.field.has-addons
                div.control.is-expanded
                  input.input(
                    type='url'
                    id='url'
                    placeholder='https://...'
                    :value='url'
                    required
                  )
                div.control
                  button.button.is-info(type='submit') Configure

        Steps(:current='step')

        ConfigureTemplate(
          v-if='step === 1'
          :url='url'
          @submit='onSubmitTemplate'
        )
</template>

<script>
import Hero from '~/components/Hero'
import Steps from '~/components/Steps'
import ConfigureTemplate from '~/components/ConfigureTemplate'

export default {
  data () {
    return {
      step: 0,
      url: 'https://phl.carto.com/api/v2/sql?q=SELECT * FROM incidents_part1_part2 LIMIT 5'
    }
  },
  methods: {
    onSubmitUrl (event) {
      const urlField = event.currentTarget.url
      this.url = urlField.value
      this.step = 1
    },
    onSubmitTemplate (template) {
      console.log('received template', template)
      this.step = 2
    }
  },
  components: {
    Hero,
    Steps,
    ConfigureTemplate
  }
}
</script>

<style lang="sass" scoped>
.url-container
  padding-bottom: 25px
</style>
