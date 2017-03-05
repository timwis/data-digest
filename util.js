var nodemailer = require('nodemailer')

var getEmailTransporter = function(stream) {
  if (stream) {
    return nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true
    });
  }

  else {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      // secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    })
  }
}

module.exports = {
  getEmailTransporter,
}