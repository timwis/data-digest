const nodemailer = require('nodemailer')
const parseMessyTime = require('parse-messy-time')
const formatDate = require('date-fns/format')
const mailgun = require('nodemailer-mailgun-transport')

const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = process.env

const getEmailTransporter = function (stream) {
  if (stream) {
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    })
  } else {
    const config = {
      auth: {
        api_key: MAILGUN_API_KEY,
        domain: MAILGUN_DOMAIN
      }
    }
    return nodemailer.createTransport(mailgun(config))
  }
}

const formatDateHelper = function (dateString, dateFormat) {
  const parsedDate = parseMessyTime(dateString)
  const formattedDate = formatDate(parsedDate, dateFormat)
  return formattedDate
}

module.exports = {
  getEmailTransporter,
  formatDateHelper
}
