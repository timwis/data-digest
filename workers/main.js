'use strict'

var _ = require('lodash')
var knex = require('knex')({
    dialect: 'sqlite3',
    connection: {
        filename: '../dev.sqlite3'
    }
})
var request = require('request')

var tick = function() {
  // query database to get queries
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
    emails = _.map(queries, 'email')
    queueRequest({
      query,
      emails,
      endpoint: subscribers[0].endpoint,
      template: subscribers[0].template,
    })
  }

}

var queueRequest = function(subscription) {
  // Schedule the object to be fetched, etc.
  setTimeout(() => { consumeRequest(subscription) }, 0)
}

var consumeRequest = function(subscription) {
  //     make request
  let url = subscription.endpoint + '?' + subscription.query
  console.log(url)
  request(url, function(error, response, body) {
    if (error) {
      console.error(error)
      return;
    }

    console.log(body)
  })
  //     render template using request's data
  //     send emails to one or more users

}

tick();
