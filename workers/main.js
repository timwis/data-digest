'use strict'

var _ = require('lodash')
var knex = require('knex')({
    dialect: 'sqlite3',
    connection: {
        filename: '../dev.sqlite3'
    }
})
var request = require('request')
var handlebars = require('handlebars')
var nodemailer = require('nodemailer')

var tick = function() {
  knex.from('queries')
    .innerJoin('subscribers', 'queries.query_id', 'subscribers.query_id')
    .innerJoin('services', 'queries.service_id', 'services.service_id')
    .then(function(rows) {
      var queries = _.groupBy(rows, function(q) {
          return q.query;
      })
      scheduleRequests(queries)
    })
}

var scheduleRequests = function(queries) {
  let query, data, emails, subscribers

  for (query in queries) {
    subscribers = queries[query];
    emails = subscribers.map(query => query.email)
    queueRequest({
      query,
      emails,
      endpoint: subscribers[0].endpoint,
      template: subscribers[0].template,
    })
  }

}

var queueRequest = function(subscription) {
  setTimeout(() => { consumeRequest(subscription) }, 0)
}

var consumeRequest = function(subscription) {
  let url = subscription.endpoint + '?' + subscription.query
  request(url, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      console.log('error!')
      return;
    }

    var template = handlebars.compile(subscription.template)
    var result = template({response: JSON.parse(body)})
	for (let email of subscription.emails) {
	  let transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true
	  });
	  transporter.sendMail({
		from: 'subscribeme@example.com',
		to: [email],
		subject: 'Your crime data',
		text: result
	  }, (err, info) => {
		console.log(info.message.toString());
	  });
    }
  })
}

tick();
