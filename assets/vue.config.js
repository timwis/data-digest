const path = require('path')
const PROXY_URL = process.env.PROXY_URL || 'http://localhost:4000'

module.exports = {
  outputDir: path.resolve(__dirname, '../priv/static'),
  devServer: {
    proxy: {
      '/api*': {
        target: PROXY_URL
      },
      '/auth*': {
        target: PROXY_URL
      }
    }
  }
}
