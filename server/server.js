const nodeEnv = process.env.NODE_ENV || 'development'
const dbConfig = require('../knexfile')[nodeEnv]
const knex = require('knex')(dbConfig)
const fastify = require('fastify')

const app = fastify()
module.exports = app

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
    const queries = await knex('queries').where('service_id', service.service_id)
    reply.send(queries)
  } catch (err) {
    reply.code(404).send(err)
  }
})

app.get('/services/:service/subscribers', async (req, reply) => {
  try {
    const service = await getService(req.params.service)
    const subscribers = await knex('queries')
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
    query: { type: 'string' },
    email: { type: 'string', format: 'email' }
  }
}
app.post('/services/:service/subscribers', postSubscriberSchema, async (req, reply) => {
  try {
    const service = await getService(req.params.service)
    const existingQueries = await knex('queries')
      .where('service_id', service.service_id)
      .where('query', req.body.query)
    if (existingQueries.length) {
      const queryId = existingQueries[0].query_id
      const subscriber = await createSubscriber(queryId, req.body.email)
      const statusCode = subscriber.created ? 201 : 200
      const subscriberId = subscriber.subscriber_id
      reply.code(statusCode).send(`Created subscriber ${subscriberId} for existing query`)
    } else {
      const queryId = await knex('queries').insert({
        service_id: service.service_id,
        query: req.body.query
      }).returning('query_id')
      const subscriber = await createSubscriber(queryId, req.body.email)
      const statusCode = subscriber.created ? 201 : 200
      const subscriberId = subscriber.subscriber_id
      reply.code(statusCode).send(`Created subscriber ${subscriberId} for new query ${queryId}`)
    }
  } catch (err) {
    reply.code(404).send(err)
  }
})
 
function getService(service) {
  return new Promise((resolve, reject) => {
    knex('services').where('slug', service).then((rows) => {
      if (rows.length) {
        resolve(rows[0])
      } else {
        reject(`service "${service}" not found`)
      }
    })
  })
}

function createSubscriber(query_id, email) {
  return new Promise((resolve, reject) => {

    // check if subscriber exists already
    knex('subscribers').where('query_id', query_id).where('email', email).then((rows) => {
      if (rows.length) {
        resolve({subscriber_id: rows[0].subscriber_id, created: false})
        return
      }

      // create subscriber
      knex('subscribers').insert({
        query_id: query_id,
        email: email
      }).returning('subscriber_id').then((subscriber_id) => resolve({subscriber_id: subscriber_id, created: true})).catch(reject)
    })
  })
}

if (!module.parent) {
  const port = process.env.PORT || '8080'
  app.listen(port, (err) => {
    if (err) throw err
    console.log(`Server listening on port ${app.server.address().port}`)
  })
}
