const assert = require('assert')
const Koa = require('koa')
const knex = require('knex')
const logger = require('koa-logger')
const helmet = require('koa-helmet')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const redisStore = require('koa-redis')
const { Nuxt, Builder } = require('nuxt')

const router = require('./router')
const passport = require('./auth')
const nuxtConfig = require('../client/nuxt.config')

const NODE_ENV = process.env.NODE_ENV || 'development'
const DEBUG = (NODE_ENV !== 'production')
const SESSION_KEY = process.env.SESSION_KEY
const REDIS_URL = process.env.REDIS_URL
const PORT = process.env.PORT || 3000
const dbConfig = require('../../knexfile')[NODE_ENV]
assert(SESSION_KEY || DEBUG, 'SESSION_KEY environment variable must be set')

module.exports = createServer

if (!module.parent) {
  const db = knex(dbConfig)
  createServer(db).then((app) => {
    app.listen(PORT, (err) => {
      if (err) throw err
      console.log(`Web server listening on ${PORT}`)
    })
  })
}

async function createServer (db) {
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

  // Nuxt.js
  if (NODE_ENV !== 'test') {
    const nuxt = new Nuxt(nuxtConfig)
    if (NODE_ENV === 'development') {
      const builder = new Builder(nuxt)
      await builder.build()
    }
    app.use(async (ctx, next) => {
      await next()
      ctx.status = 200
      return new Promise((resolve, reject) => {
        ctx.res.on('close', resolve)
        ctx.res.on('finish', resolve)
        if (ctx.state) ctx.req.state = ctx.state // pass user info to nuxt
        nuxt.render(ctx.req, ctx.res, (promise) => {
          promise.then(resolve).catch(reject)
        })
      })
    })
  }

  return app
}
