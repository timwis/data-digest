const nodeExternals = require('webpack-node-externals')

module.exports = {
  srcDir: 'web/client',
  env: {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL,
    HOSTNAME: process.env.HOSTNAME
  },
  head: {
    title: 'subscribeme',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Monitors an API for new data and sends digest emails to subscribers.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#3B8070' },
  build: {
    vendor: [
      'vue-awesome'
    ],
    extend (config, { isServer }) {
      if (isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/es6-promise|\.(?!(?:js|json)$).{1,5}$/i, /^vue-awesome/]
          })
        ]
      }
      config.resolve.alias.handlebars = 'handlebars/dist/handlebars'
    }
  },
  css: [
    'bulma',
    'bulma-steps/dist/bulma-steps.min.css',
    'buefy/lib/buefy.css'
  ],
  plugins: [
    '~/plugins/vue-awesome',
    { src: '~/plugins/vue-codemirror', ssr: false },
    '~/plugins/buefy'
  ]
}
