const nodeEnv = process.env.NODE_ENV || 'development'
const dbConfig = require('../knexfile')[nodeEnv]
const knex = require('knex')(dbConfig)
const serverRouter = require('server-router')
const jsonBody = require('body/json')

module.exports = serverRouter([
  [
    '/services/:service',
    {
      get: (req, res, params) => {
        getService(params.service)
          .catch((error) => {
            res.writeHead(404)
            res.end(error)
          })
          .then((service) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(service))
          })
      }
    }
  ],
  [
    '/services/:service/queries',
    {
      get: (req, res, params) => {
        getService(params.service)
          .catch((error) => {
            res.writeHead(404)
            res.end(error)
          })
          .then((service) => {
            knex('queries')
              .where('service_id', service.service_id)
              .then((rows) => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(rows))
              })
          })
      }
    }
  ],
  [
    '/services/:service/subscribers',
    {
      get: (req, res, params) => {
        getService(params.service)
          .catch((error) => {
            res.writeHead(404)
            res.end(error)
          })
          .then((service) => {
            knex('queries')
              .where('service_id', service.service_id)
              .innerJoin('subscribers', 'subscribers.query_id', 'queries.query_id')
              .then((rows) => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(rows))
              })
          })
      },
      post: (req, res, params) => {
        getService(params.service)
          .catch((error) => {
            res.writeHead(404)
            res.end(error)
          })
          .then((service) => {
            jsonBody(req, res, (error, body) => {
              // validate body
              if (!body.query || !body.email) {
                res.writeHead(400)
                res.end('query and email required to create subscriber')
                return
              }

              // try to get existing query
              knex('queries')
                .where('service_id', service.service_id)
                .where('query', body.query)
                .then((rows) => {
                  if (rows.length) {
                    createSubscriber(rows[0].query_id, body.email).then((result) => {
                      res.writeHead(result.created ? 201 : 200)
                      res.end(`Created subscriber ${result.subscriber_id} for existing query`)
                    })
                  } else {
                    knex('queries').insert({
                      service_id: service.service_id,
                      query: body.query
                    }).returning('query_id').then((query_id) => {
                      createSubscriber(query_id, body.email).then((result) => {
                        res.writeHead(result.created ? 201 : 200)
                        res.end(`Created subscriber ${result.subscriber_id} for new query ${query_id}`)
                      })
                    })
                  }
                })
            })
          })
      }
    }
  ],
  [
    '/404',
    (req, res) => {
      res.writeHead(404)
      res.end('not found')
    }
  ]
])

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
