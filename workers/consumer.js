const Tortoise = require('tortoise')
const handlebars = require('handlebars')
const fetch = require('isomorphic-fetch')
const { getEmailTransporter, formatDateHelper } = require('../util')

handlebars.registerHelper('formatDate', formatDateHelper)
const DEBUG = (process.env.NODE_ENV !== 'production')
const transporter = getEmailTransporter(DEBUG)
const RABBITMQ_URL = process.env.RABBITMQ_URL || process.env.RABBITMQ_BIGWIG_URL
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@noreply.com'

module.exports = { consumeJob }

if (!module.parent) {
  const tortoise = new Tortoise(RABBITMQ_URL)
  tortoise
    .queue('queries')
    .dead('exchange.dead', 'queue.dead')
    .prefetch(1)
    .json()
    .subscribe(consumeJob)
}

async function consumeJob (job, ack, nack) {
  try {
    const templates = compileTemplates(job)

    const url = templates.url()
    console.log(`Fetching: ${url}`)
    const data = await fetchData(url)

    const subject = templates.subject({ data })
    const body = templates.body({ data })

    const shouldSend = (body.trim().length > 0)
    if (shouldSend) {
      for (let recipient of job.recipients) {
        const result = await sendEmail({
          from: EMAIL_FROM,
          to: recipient,
          subject,
          html: body
        })
        console.log(result)
      }
    } else {
      console.log(`body is empty; not sending`)
    }
    ack()
  } catch (err) {
    console.error(err)
    nack(false)
  }
}

function compileTemplates (job) {
  return {
    url: handlebars.compile(job.url), // allows date to be injected
    subject: handlebars.compile(job.subjectTemplate),
    body: handlebars.compile(job.bodyTemplate)
  }
}

async function fetchData (url) {
  const response = await fetch(url)
  if (response.status >= 400) {
    throw new Error(`Server returned status code ${response.status}`)
  }
  return response.json()
}

function sendEmail (opts) { // TODO: Use promisify lib or move this
  return new Promise((resolve, reject) => {
    transporter.sendMail(opts, (err, info) => {
      if (err) reject(err)
      else resolve(info)
    })
  })
}
