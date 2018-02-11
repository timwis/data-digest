const Koa = require('koa')
const knex = require('knex')
const logger = require('koa-logger')
const helmet = require('koa-helmet')
const bodyParser = require('koa-bodyparser')
const router = require('./router')

const NODE_ENV = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 3000
const dbConfig = require('../knexfile')[NODE_ENV]

module.exports = createServer

if (!module.parent) {
  const db = knex(dbConfig)
  const app = createServer(db)
  app.listen(PORT, (err) => {
    if (err) throw err
    console.log(`Web server listening on ${PORT}`)
  })
}

function createServer (db) {
  const app = new Koa()
  app.context.db = db
  app.use(helmet())

  if (NODE_ENV === 'development') {
    app.use(logger())
  }

  app.use(bodyParser({
    enableTypes: ['json'],
    jsonLimit: '5mb',
    strict: true,
    onerror: (err, ctx) => ctx.throw('body parse error', 422) // eslint-disable-line
  }))

  app.use(router.routes())
  // app.use(router.allowedMethods()) // TODO: what's this actually do?

  return app
}
