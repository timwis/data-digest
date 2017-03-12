const fastify = require('fastify')

module.exports = createServer

if (!module.parent) { // Only run if called directly, not within tests
  const nodeEnv = process.env.NODE_ENV || 'development'
  const dbConfig = require('../knexfile')[nodeEnv]
  const db = require('knex')(dbConfig)

  const app = createServer(db)
  const port = process.env.PORT || '8080'
  app.listen(port, (err) => {
    if (err) throw err
    console.log(`Server listening on port ${app.server.address().port}`)
  })
}

// db -> app
function createServer (db) {
  const app = fastify()

  app.get('/services/:service', async (req, reply) => {
    try {
      const service = await getService(req.params.service)
      reply.send(service)
    } catch (err) {
      reply.code(404).send(err)
    }
  })

  app.get('/services/:service/queries', async (req, reply) => {
    try {
      const service = await getService(req.params.service)
      const queries = await db('queries').where('service_id', service.service_id)
      reply.send(queries)
    } catch (err) {
      reply.code(404).send(err)
    }
  })

  app.get('/services/:service/subscribers', async (req, reply) => {
    try {
      const service = await getService(req.params.service)
      const subscribers = await db('queries')
        .where('service_id', service.service_id)
        .innerJoin('subscribers', 'subscribers.query_id', 'queries.query_id')
      reply.send(subscribers)
    } catch (err) {
      reply.code(404).send(err)
    }
  })

  const postSubscriberSchema = {
    params: {
      service: { type: 'string' }
    },
    payload: {
      url: { type: 'string' },
      email: { type: 'string', format: 'email' }
    }
  }
  app.post('/services/:service/subscribers', postSubscriberSchema, async (req, reply) => {
    try {
      const service = await getService(req.params.service)
      const existingQueries = await db('queries')
        .where('service_id', service.service_id)
        .where('url', req.body.url)
      if (existingQueries.length) {
        const queryId = existingQueries[0].query_id
        const subscriber = await createSubscriber(queryId, req.body.email)
        const statusCode = subscriber.created ? 201 : 200
        const subscriberId = subscriber.subscriber_id
        reply.code(statusCode).send(`Created subscriber ${subscriberId} for existing query`)
      } else {
        if (isUrlValid(endpoint, url)) {
          const insertedQueryIds = await db('queries').insert({
            service_id: service.service_id,
            url: req.body.url
          }).returning('query_id')
          const queryId = insertedQueryIds[0]
          const subscriber = await createSubscriber(queryId, req.body.email)
          const statusCode = subscriber.created ? 201 : 200
          const subscriberId = subscriber.subscriber_id
          reply.code(statusCode).send(`Created subscriber ${subscriberId} for new query ${queryId}`)
        } else {
          reply.code(400).send(`Invalid url`)
        }
      }
    } catch (err) {
      reply.code(404).send(err)
    }
  })

  return app
   
  async function getService (service) {
    const services = await db('services').where('slug', service)
    if (!services.length) throw `Service ${service} not found`
    else return services[0]
  }

  async function createSubscriber (queryId, email) {
    const existingSubscribers = await db('subscribers')
      .where('query_id', queryId)
      .where('email', email)

    if (existingSubscribers.length) {
      const subscriberId = existingSubscribers[0].subscriber_id
      return { subscriber_id: subscriberId, created: false }
    } else {
      const subscriberId = await db('subscribers').insert({
        query_id: queryId,
        email: email
      }).returning('subscriber_id')
      return { subscriber_id: subscriberId, created: true }
    }
  }

  function isUrlValid (endpoint, url) {
    const regex = new RegExp(endpoint)
    return regex.test(url)
  }
}
