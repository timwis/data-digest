const assert = require('assert')
const Koa = require('koa')
const knex = require('knex')
const logger = require('koa-logger')
const helmet = require('koa-helmet')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const redisStore = require('koa-redis')

const router = require('./router')
const passport = require('./auth')

const NODE_ENV = process.env.NODE_ENV || 'development'
const DEBUG = (NODE_ENV !== 'production')
const SESSION_KEY = process.env.SESSION_KEY
const REDIS_URL = process.env.REDIS_URL
const PORT = process.env.PORT || 3000
const dbConfig = require('../knexfile')[NODE_ENV]
assert(SESSION_KEY || DEBUG, 'SESSION_KEY environment variable must be set')

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

  if (NODE_ENV === 'development') app.use(logger())

  app.use(bodyParser({
    enableTypes: ['json'],
    jsonLimit: '5mb',
    strict: true,
    onerror: (err, ctx) => ctx.throw('body parse error', 422) // eslint-disable-line
  }))

  app.keys = [SESSION_KEY || '']
  const sessionOpts = {}
  if (REDIS_URL) sessionOpts.store = redisStore({ url: REDIS_URL })
  app.use(session(sessionOpts, app))
  app.use(passport.initialize())
  app.use(passport.session())

  app.use(router.routes())
  app.use(router.allowedMethods())

  return app
}
