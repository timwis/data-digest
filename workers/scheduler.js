const groupBy = require('lodash/groupBy')
const map = require('lodash/map')
const knex = require('knex')
const Tortoise = require('tortoise')

const { NODE_ENV, RABBITMQ_URL } = process.env
const dbConfig = require('../knexfile')[NODE_ENV || 'development']

module.exports = {
  tick,
  getUniqueQueries
}

if (!module.parent) { // Only run if called directly, not within tests
  const db = knex(dbConfig)
  const tortoise = new Tortoise(RABBITMQ_URL)
  const queue = tortoise.queue('queries')
  tick(db, queue).then(() => {
    db.destroy()
    tortoise.destroy()
    process.exit() // HACK: tortoise/queue hangs
  })
}

async function tick (db, queue) {
  try {
    const jobs = await getUniqueQueries(db)
    const publishPromises = jobs.map(queue.publish)
    await Promise.all(publishPromises)
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
      subjectTemplate: subscribers[0].subject_template,
      bodyTemplate: subscribers[0].body_template
    }
  })
  return queries
}
