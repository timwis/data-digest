const fastify = require('fastify')
const knex = require('knex')

const PORT = process.env.PORT || '8080'
const NODE_ENV = process.env.NODE_ENV || 'development'
const dbConfig = require('../knexfile')[NODE_ENV]

module.exports = createServer

if (!module.parent) { // Only run if called directly, not within tests
  const db = knex(dbConfig)
  const app = createServer(db)
  app.listen(PORT, (err) => {
    if (err) throw err
    console.log(`Server listening on port ${app.server.address().port}`)
  })
}

// db -> app
function createServer (db) {
  const app = fastify()

  app.get('/services', async (req, reply) => {
    try {
      return getServices(db)
    } catch (err) {
      reply.code(500).send(err)
    }
  })

  app.get('/services/:serviceSlug', async (req, reply) => {
    try {
      const { serviceSlug } = req.params
      const services = await getServicesBySlug(db, serviceSlug)
      if (services.length === 0) reply.notFound()
      else return services[0]
    } catch (err) {
      reply.code(404).send(err)
    }
  })

  app.get('/services/:serviceSlug/queries', async (req, reply) => {
    try {
      const { serviceSlug } = req.params
      return getQueriesByServiceSlug(db, serviceSlug)
    } catch (err) {
      console.error(err)
      reply.code(404).send(err)
    }
  })

  app.get('/services/:serviceSlug/subscribers', async (req, reply) => {
    try {
      const { serviceSlug } = req.params
      return getSubscribersByServiceSlug(db, serviceSlug)
    } catch (err) {
      reply.code(404).send(err)
    }
  })

  const postSubscriberSchema = {
    payload: {
      url: { type: 'string' },
      email: { type: 'string', format: 'email' }
    }
  }
  app.post('/services/:serviceSlug/subscribers', postSubscriberSchema, async (req, reply) => {
    try {
      const { serviceSlug } = req.params
      const { url, email } = req.body

      const services = await getServicesBySlug(serviceSlug)
      if (services.length === 0) return reply.notFound()
      const service = services[0]
      const serviceId = service.id

      const existingQueries = await getMatchingQueries({ serviceId, url })
      const doesQueryExist = (existingQueries.length > 0)
      if (doesQueryExist) {
        // Create subscriber for existing query
        const existingQueryId = existingQueries[0].id
        const subscriber = await createSubscriber(existingQueryId, email)
        const statusCode = subscriber.created ? 201 : 200
        reply.code(statusCode).send(`Created subscriber ${subscriber.id} for existing query`)
      } else {
        if (!isUrlValid(service.endpoint, url)) {
          reply.code(400).send(`Invalid url`)
        } else {
          // Create query then create subscriber
          const queryId = await createQuery(db, serviceId, url)
          const subscriber = await createSubscriber(db, queryId, email)
          const statusCode = subscriber.created ? 201 : 200
          reply.code(statusCode).send(`Created subscriber ${subscriber.id} for new query ${queryId}`)
        }
      }
    } catch (err) {
      reply.code(404).send(err)
    }
  })

  return app
}

function getServices (db) {
  return db('services')
}

function getServicesBySlug (db, serviceSlug) {
  return db('services')
    .where('slug', serviceSlug)
}

function getQueriesByServiceSlug (db, serviceSlug) {
  return db('queries')
    .select('queries.id', 'service_id', 'url')
    .leftJoin('services', 'services.id', 'queries.service_id')
    .where('services.slug', serviceSlug)
}

function getSubscribersByServiceSlug (db, serviceSlug) {
  return db('subscribers')
    .select('subscribers.id', 'email', 'query_id', 'service_id', 'url')
    .innerJoin('queries', 'queries.id', 'subscribers.query_id')
    .innerJoin('services', 'services.id', 'queries.service_id')
    .where('services.slug', serviceSlug)
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

function createQuery (db, serviceId, url) {
  return db('queries').insert({
    service_id: serviceId,
    url
  }).returning('query_id')
    .then((queryIds) => queryIds[0])
}

async function createSubscriber (db, queryId, email) {
  const existingSubscribers = await db('subscribers')
    .where('query_id', queryId)
    .where('email', email)

  if (existingSubscribers.length > 0) {
    const subscriberId = existingSubscribers[0].id
    return { id: subscriberId, created: false }
  } else {
    const subscriberId = await db('subscribers').insert({
      query_id: queryId,
      email: email
    }).returning('id')
    return { id: subscriberId, created: true }
  }
}
