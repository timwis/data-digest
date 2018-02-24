const Router = require('koa-router')
const validate = require('koa-superstruct')
const slug = require('slug')
const shortid = require('shortid')

const schemas = require('./schemas')
const passport = require('./auth')
const NODE_ENV = process.env.NODE_ENV

const router = new Router({ prefix: '/api' })
module.exports = router

// authenticate with auth code
router.get(
  '/authenticate',
  passport.authenticate('auth0'),
  async function (ctx) {
    ctx.redirect('/')
    ctx.status = 301
  }
)

// open authentication during test mode
if (NODE_ENV === 'test') {
  router.post(
    '/authenticate-test',
    async function (ctx) {
      await ctx.login({
        id: 'tester|tester',
        displayName: 'tester@tester.com',
        picture: 'http://tester.com/tester.png',
        nickname: 'tester'
      })
      ctx.status = 200
    }
  )
}

// logout
router.post(
  '/logout',
  async function (ctx) {
    ctx.logout()
    ctx.status = 200
  }
)

// current user
router.get(
  '/user',
  requireAuth,
  async function (ctx) {
    ctx.body = ctx.state.user
  }
)

// get all services (for current user)
router.get(
  '/services',
  requireAuth,
  async function (ctx) {
    const userId = ctx.state.user.id
    ctx.body = await getServices(ctx.db, userId)
  }
)

// create service
router.post(
  '/services',
  requireAuth,
  validate(schemas.service.create),
  async function (ctx) {
    const payload = ctx.request.body
    payload.id = shortid.generate()
    payload.slug = slugify(payload.name, payload.id)
    payload.user_id = ctx.state.user.id
    ctx.body = await createService(ctx.db, payload)
    ctx.status = 201
  }
)

// get specific service
router.get(
  '/services/:serviceSlug',
  requireAuth,
  async function (ctx) {
    const { serviceSlug } = ctx.params
    const userId = ctx.state.user.id
    const services = await getServicesBySlug(ctx.db, serviceSlug)
    if (services.length === 0) ctx.throw(404)
    else if (services[0].user_id !== userId) ctx.throw(401)
    ctx.body = services[0]
    ctx.status = 200
  }
)

// update specific service
router.patch(
  '/services/:serviceSlug',
  requireAuth,
  validate(schemas.service.update),
  async function (ctx) {
    const { serviceSlug } = ctx.params
    const userId = ctx.state.user.id
    const services = await getServicesBySlug(ctx.db, serviceSlug)
    if (services.length === 0) ctx.throw(404)
    else if (services[0].user_id !== userId) ctx.throw(401)

    const payload = ctx.request.body
    if (payload.name) {
      const id = services[0].id
      payload.slug = slugify(payload.name, id)
    }
    const conditions = { id: services[0].id }
    const service = await updateService(ctx.db, payload, conditions)
    ctx.body = service
  }
)

// delete specific service
router.delete(
  '/services/:serviceSlug',
  requireAuth,
  async function (ctx) {
    const { serviceSlug } = ctx.params
    const userId = ctx.state.user.id
    const services = await getServicesBySlug(ctx.db, serviceSlug)
    if (services.length === 0) ctx.throw(404)
    else if (services[0].user_id !== userId) ctx.throw(401)

    const serviceId = services[0].id
    await deleteService(ctx.db, serviceId)
    ctx.status = 204
  }
)

// add subscriber
router.post(
  '/services/:serviceSlug/subscribers',
  validate(schemas.subscriber.create),
  async function (ctx) {
    const { serviceSlug } = ctx.params
    const { url, email } = ctx.request.body

    const services = await getServicesBySlug(ctx.db, serviceSlug)
    if (services.length === 0) ctx.throw(404)
    const service = services[0]
    const serviceId = service.id

    if (!isUrlValid(service.endpoint, url)) {
      return ctx.throw(422, '`url` does not match subscription configuration')
    }

    const queryId = await getOrCreateQuery(ctx.db, { serviceId, url })
    const subscriber = await getOrCreateSubscriber(ctx.db, { queryId, email })

    ctx.status = (subscriber.created) ? 201 : 200
    ctx.body = subscriber.id
  }
)

function requireAuth (ctx, next) {
  if (ctx.isAuthenticated()) {
    return next()
  } else {
    ctx.status = 401
  }
}

function getServices (db, userId) {
  return db('services')
    .where('user_id', userId)
}

function slugify (input, id) {
  return `${slug(input, { lower: true })}-${id}`
}

async function createService (db, payload) {
  await db('services')
    .insert(payload)

  const [ service ] = await db('services')
    .where('id', payload.id)

  return service
}

function getServicesBySlug (db, serviceSlug) {
  return db('services')
    .where('slug', serviceSlug)
}

async function getOrCreateQuery (db, { serviceId, url }) {
  const existingQueries = await getMatchingQueries(db, { serviceId, url })
  const doesQueryExist = (existingQueries.length > 0)

  return (doesQueryExist)
    ? existingQueries[0].id
    : await createQuery(db, { serviceId, url })
}

function getMatchingQueries (db, { serviceId, url }) {
  return db('queries')
    .where('service_id', serviceId)
    .where('url', url)
}

function isUrlValid (endpoint, url) {
  const regex = new RegExp(endpoint)
  return regex.test(url)
}

function createQuery (db, { serviceId, url }) {
  return db('queries').insert({
    service_id: serviceId,
    url
  }).returning('id')
    .then((ids) => ids[0])
}

async function getOrCreateSubscriber (db, { queryId, email }) {
  const existingSubscribers = await getMatchingSubscribers(db, { queryId, email })
  const doesSubscriberExist = (existingSubscribers.length > 0)

  if (doesSubscriberExist) {
    const id = existingSubscribers[0].id
    return { created: false, id }
  } else {
    const id = await createSubscriber(db, { queryId, email })
    return { created: true, id }
  }
}

function getMatchingSubscribers (db, { queryId, email }) {
  return db('subscribers')
    .where('query_id', queryId)
    .where('email', email)
}

function createSubscriber (db, { queryId, email }) {
  return db('subscribers').insert({
    query_id: queryId,
    email
  }).returning('id')
    .then((ids) => ids[0])
}

function updateService (db, updates, conditions) {
  return db('services')
    .update(updates)
    .where(conditions)
    .then(() => {
      return db('services')
        .where(conditions)
        .then((results) => results[0])
    })
}

function deleteService (db, id) {
  return db('services')
    .where('id', id)
    .delete()
}
