const Router = require('koa-router')
const validate = require('koa-superstruct')
const schemas = require('./schemas')

const router = new Router({ prefix: '/api' })
module.exports = router

// get all services
router.get(
  '/services',
  async function (ctx) {
    ctx.body = await getServices(ctx.db)
  }
)

// create service
router.post(
  '/services',
  validate(schemas.service.create),
  async function (ctx) {
    const payload = ctx.request.body
    ctx.body = await createService(ctx.db, payload)
    ctx.status = 201
  }
)

// get specific service
router.get(
  '/services/:serviceSlug',
  async function (ctx) {
    const { serviceSlug } = ctx.params
    const services = await getServicesBySlug(ctx.db, serviceSlug)
    if (services.length === 0) ctx.throw(404)
    ctx.body = services[0]
    ctx.status = 200
  }
)

// update specific service
router.patch(
  '/services/:serviceSlug',
  validate(schemas.service.update),
  async function (ctx) {
    const { serviceSlug } = ctx.params
    const services = await getServicesBySlug(ctx.db, serviceSlug)
    if (services.length === 0) ctx.throw(404)

    const payload = ctx.request.body
    const conditions = { id: services[0].id }
    const service = await updateService(ctx.db, payload, conditions)
    ctx.body = service
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

function getServices (db) {
  return db('services')
}

async function createService (db, payload) {
  const [ serviceId ] = await db('services').insert(payload)
  const [ service ] = await db('services').where('id', serviceId)
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
  }).then((ids) => ids[0])
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
  }).then((ids) => ids[0])
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
