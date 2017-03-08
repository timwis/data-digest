const test = require('ava')
const request = require('supertest')

const server = require('../server/server')

test.cb('GET to /services/unknown returns 404', (t) => {
  request(server)
    .get('/services/foo')
    .expect(404)
    .end((err, res) => {
      if (err) return t.fail(err)
      t.pass()
      t.end()
    })
})

test.cb('GET to /services/crime-incidents returns service object', (t) => {
  request(server)
    .get('/services/crime-incidents')
    .expect(200)
    .expect('Content-type', 'application/json')
    .end((err, res) => {
      if (err) return t.fail(err)
      t.is(res.body.slug, 'crime-incidents', 'slug is crime-incidents')
      t.end()
    })
})

test.cb('GET to /services/crime-incidents/queries returns list of queries', (t) => {
  request(server)
    .get('/services/crime-incidents/queries')
    .expect(200)
    .expect('Content-type', 'application/json')
    .end((err, res) => {
      if (err) return t.fail(err)
      t.true(Array.isArray(res.body), 'response is an array')
      t.truthy(res.body[0].query_id, 'query_id property exists')
      t.truthy(res.body[0].query, 'query property exists')
      t.truthy(res.body[0].service_id, 'service_id property exists')
      t.end()
    })
})

test.cb('GET to /services/crime-incidents/subscribers returns list of subscribers', (t) => {
  request(server)
    .get('/services/crime-incidents/subscribers')
    .expect(200)
    .expect('Content-type', 'application/json')
    .end((err, res) => {
      if (err) return t.fail(err)
      t.true(Array.isArray(res.body), 'response is array')
      t.truthy(res.body[0].subscriber_id, 'subscriber_id property exists')
      t.truthy(res.body[0].email, 'email property exists')
      t.end()
    })
})

test.cb('POST to /services/crime-incidents/subscribers returns 200 or 201', (t) => {
  request(server)
    .post('/services/crime-incidents/subscribers')
    .send({ email: 'foo@bar.com', query: 'q=test' })
    .end((err, res) => {
      if (err) return t.fail(err)
      t.true((res.statusCode === 200 || res.statusCode === 201), 'status code is 200 or 201')
      t.end()
    })
})

test.cb('GET to /unknown returns 404', (t) => {
  request(server)
    .get('/unknown')
    .expect(404)
    .end((err, res) => {
      if (err) return t.fail(err)
      t.pass('not found')
      t.end()
    })
})
