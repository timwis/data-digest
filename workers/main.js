const nodeEnv = process.env.NODE_ENV || 'development'
const dbConfig = require('../knexfile')[nodeEnv]
const db = require('knex')(dbConfig)
const groupBy = require('lodash/groupBy')
const map = require('lodash/map')
const axios = require('axios')
const handlebars = require('handlebars')

const transporter = require('../util').getEmailTransporter(process.env.DEBUG)

const emailFrom = process.env.DEFAULT_FROM_EMAIL || 'noreply@noreply.com'
const emailSubject = 'Your crime data'

module.exports = {
  tick,
  getUniqueQueries,
  queueJob,
  consumeJob
}

tick(db) // run tick. need to move to its own file.

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
      .innerJoin('subscribers', 'queries.query_id', 'subscribers.query_id')
      .innerJoin('services', 'queries.service_id', 'services.service_id')

    const subscribersByQuery = groupBy(subscribers, 'query')

    const queries = map(subscribersByQuery, (subscribers, query) => {
      return {
        query,
        emails: map(subscribers, 'email'),
        endpoint: subscribers[0].endpoint,
        template: subscribers[0].template
      }
    })
    return queries
}

function queueJob (job) {
  // Queue the desired job. In the future, this may use SQS, RabbitMQ, or
  // some other full-featured queue. For now, just schedule in the current
  // thread.
  setTimeout(() => { consumeJob(job) }, 0)
}

async function consumeJob (job) {
  const url = job.endpoint + '?' + job.query
  try {
    const response = await axios.get(url)
    const results = await sendEmail(job, response.data)
    console.log(`Sent ${results.length} emails`)
    results.forEach((result) => { console.log(result.message.toString()) })
  } catch (err) { // Not sure this will catch non-200 statusCodes
    console.error(err)
  }
}

function sendEmail (job, data) { // TODO: pass down transporter as arg
  const template = handlebars.compile(job.template)
  const body = template({ response: data })
  const emailsSent = job.emails.map((email) => {
    return transporter.sendMail({
      from: emailFrom,
      to: [email],
      subject: emailSubject,
      html: body
    })
  })
  return Promise.all(emailsSent)
}
