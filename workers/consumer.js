const axios = require('axios')
const handlebars = require('handlebars')
const Tortoise = require('tortoise')
const { getEmailTransporter, formatDateHelper } = require('../util')

handlebars.registerHelper('formatDate', formatDateHelper)
const DEBUG = (process.env.NODE_ENV !== 'production')
const transporter = getEmailTransporter(DEBUG)
const RABBITMQ_URL = process.env.RABBITMQ_URL || process.env.RABBITMQ_BIGWIG_URL
const emailFrom = process.env.DEFAULT_FROM_EMAIL || 'noreply@noreply.com'

module.exports = {
  consumeJob
}

if (!module.parent) { // Only run if called directly, not within tests
  const tortoise = new Tortoise(RABBITMQ_URL)
  tortoise
    .queue('queries')
    .prefetch(1)
    .json()
    .subscribe(consumeJob)
}

async function consumeJob (job, ack, nack) {
  try {
    const url = handlebars.compile(job.url)()
    const response = await axios.get(url)
    const results = await sendEmail(job, response.data)
    console.log(`Sent ${results.length} emails`)
    results.forEach((result) => { console.log(result) }) // .message.toString()) })
    ack()
  } catch (err) { // Not sure this will catch non-200 statusCodes
    console.error(err)
    nack()
  }
}

function sendEmail (job, data) { // TODO: pass down transporter as arg
  const subjectTemplate = handlebars.compile(job.subjectTemplate)
  const subject = subjectTemplate({ response: data })

  const bodyTemplate = handlebars.compile(job.bodyTemplate)
  const body = bodyTemplate({ response: data })

  const emailsSent = job.emails.map((email) => {
    return new Promise((resolve, reject) => {
      transporter.sendMail({
        from: emailFrom,
        to: [email],
        subject: subject,
        html: body
      }, (err, info) => {
        if (err) reject(err)
        else resolve(info)
      })
    })
  })
  return Promise.all(emailsSent)
}
