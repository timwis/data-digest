const path = require('path')

module.exports = {
  outputDir: path.resolve(__dirname, '../priv/static'),
  devServer: {
    proxy: {
      '/api*': {
        target: 'http://localhost:4000'
      },
      '/auth*': {
        target: 'http://localhost:4000'
      }
    }
  }
}
