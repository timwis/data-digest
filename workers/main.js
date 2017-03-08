const nodeEnv = process.env.NODE_ENV || 'development'
const dbConfig = require('../knexfile')[nodeEnv]
const knex = require('knex')(dbConfig)
const groupBy = require('lodash/groupBy')
const axios = require('axios')
const handlebars = require('handlebars')

const transporter = require('../util').getEmailTransporter(process.env.DEBUG)

const emailFrom = process.env.DEFAULT_FROM_EMAIL || 'noreply@noreply.com'
const emailSubject = 'Your crime data'

module.exports.tick = tick
module.exports.queueRequest = queueRequest
module.exports.consumeRequest = consumeRequest

async function tick () {
  try {
    const subscribers = await knex.from('queries')
      .innerJoin('subscribers', 'queries.query_id', 'subscribers.query_id')
      .innerJoin('services', 'queries.service_id', 'services.service_id')
    const subscribersByQuery = groupBy(subscribers, 'query')

    // Queue each unique query
    for (let query in subscribersByQuery) {
      const subscribers = subscribersByQuery[query]
      const emails = subscribers.map((subscriber) => subscriber.email)
      const endpoint = subscribers[0].endpoint
      const template = subscribers[0].template
      queueRequest({ query, emails, endpoint, template })
    }
  } catch (err) {
    console.error('Error fetching subscribers')
  }
}

function queueRequest (request) {
  // Queue the desired request. In the future, this may use SQS, RabbitMQ, or
  // some other full-featured queue. For now, just schedule in the current
  // thread.
  setTimeout(() => { consumeRequest(request) }, 0)
}

async function consumeRequest (request) {
  const url = request.endpoint + '?' + request.query
  try {
    const response = await axios.get(url)
    const results = await sendEmail(request, response.data)
    console.log(`Sent ${results.length} emails`)
    results.forEach((result) => { console.log(result.message.toString()) })
  } catch (err) { // Not sure this will catch non-200 statusCodes
    console.error(err)
  }
}

function sendEmail (request, data) {
  const template = handlebars.compile(request.template)
  const body = template({ response: data })
  const emailsSent = request.emails.map((email) => {
    return transporter.sendMail({
      from: emailFrom,
      to: [email],
      subject: emailSubject,
      html: body
    })
  })
  return Promise.all(emailsSent)
}

tick()
