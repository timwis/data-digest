const groupBy = require('lodash/groupBy')
const map = require('lodash/map')

module.exports = {
  tick,
  getUniqueQueries,
  queueJob
}

if (!module.parent) { // Only run if called directly, not within tests
  const nodeEnv = process.env.NODE_ENV || 'development'
  const dbConfig = require('../knexfile')[nodeEnv]
  const db = require('knex')(dbConfig)
  tick(db).then(() => db.destroy())
}

async function tick (db) {
  try {
    const jobs = await getUniqueQueries(db)
    jobs.forEach(queueJob)
  } catch (err) {
    console.error('Error fetching subscribers')
  }
}

async function getUniqueQueries (db) {
  const subscribers = await db.from('queries')
    .innerJoin('subscribers', 'queries.id', 'subscribers.query_id')
    .innerJoin('services', 'queries.service_id', 'services.id')

  const subscribersByQuery = groupBy(subscribers, 'url')

  const queries = map(subscribersByQuery, (subscribers, url) => {
    return {
      url,
      emails: map(subscribers, 'email'),
      template: subscribers[0].template
    }
  })
  return queries
}

function queueJob (job) {
  console.log(job)
}
