const nodemailer = require('nodemailer')
const parseMessyTime = require('parse-messy-time')
const formatDate = require('date-fns/format')

const getEmailTransporter = function (stream) {
  if (stream) {
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    })
  } else {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      // secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
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
