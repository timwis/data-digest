const axios = require('axios')
const handlebars = require('handlebars')
const Tortoise = require('tortoise')

const transporter = require('../util').getEmailTransporter(process.env.DEBUG)

const emailFrom = process.env.DEFAULT_FROM_EMAIL || 'noreply@noreply.com'
const emailSubject = 'Your crime data'

module.exports = {
  consumeJob
}

if (!module.parent) { // Only run if called directly, not within tests
  console.log('consuming jobs')
  const RABBITMQ_URL = process.env.RABBITMQ_URL
  const tortoise = new Tortoise(RABBITMQ_URL)
  tortoise
    .queue('queries')
    .prefetch(1)
    .json()
    .subscribe((msg, ack) => {
      console.log('received', msg)
      ack()
    })
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
