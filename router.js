const nodeEnv = process.env.NODE_ENV || 'development'
const dbConfig = require('./knexfile')[nodeEnv]
const knex = require('knex')(dbConfig)
const serverRouter = require('server-router')

module.exports = serverRouter([
  [
    '/services/:service',
    {
      get: (req, res, params) => {
        getService(params.service)
          .catch((error) => {
            res.writeHead(404);
            res.end(error)
          })
          .then((service) => {
            res.end(JSON.stringify(service))
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