<template lang="pug">
  div
    p
      | Add subscribers by sending a <code>POST</code> request
      | containing the subscriber's <code>email</code> and the
      | <code>url</code> being subscribed to.
    div.tabs
      ul
        li(:class='{"is-active": tab === "curl"}')
          a(@click='tab = "curl"') cURL
        li(:class='{"is-active": tab === "javascript"}')
          a(@click='tab = "javascript"') JavaScript

    pre(v-if='tab === "curl"') {{ curl }}
    pre(v-if='tab === "javascript"') {{ javascript }}

    h4.title.is-4 Dynamic URLs
    p
      | Your website can change the <code>url</code> being subscribed
      | to, adding a user's ID, category, etc., so long as the <code>url</code>
      | validates against the service's regex (<code>{{ endpoint }}</code>).
      | If you want a date injected into the <code>url</code> when
      | the subscription runs, use the special <code>formatDate</code>
      | handlebars tag. For example:

    pre(v-text="`https://example.com/api/?start_date={{ formatDate '2 days ago' 'YYYY-MM-DD' }}`")
</template>

<script>
import urlJoin from 'url-join'
import { stripIndent } from 'common-tags'

const HOSTNAME = process.env.HOSTNAME
const sampleEmail = `sample@sample.com`
const sampleUrl = `https://example.com/api/latest/`

export default {
  props: ['slug', 'endpoint'],
  data () {
    return {
      tab: 'curl'
    }
  },
  computed: {
    subscriptionEndpoint () {
      return urlJoin(HOSTNAME, `/services/${this.slug}/subscribers`)
    },
    curl () {
      const payload = { email: sampleEmail, url: sampleUrl }
      return stripIndent`
        curl -H "Content-Type: application/json" \\
        -X POST '${JSON.stringify(payload)}' \\
        ${this.subscriptionEndpoint}
      `
    },
    javascript () {
      return stripIndent`
        const payload = {
          email: '${sampleEmail}',
          url: '${sampleUrl}'
        }
        fetch('${this.subscriptionEndpoint}', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      `
    }
  }
}
</script>

<style lang="sass" scoped>
pre
  margin: 10px 0
</style>
