const test = require('tape')
const request = require('supertest')

const router = require('../server/router')

test('GET to /services/unknown returns 404', (t) => {
  t.plan(1)
  request(router)
    .get('/services/foo')
    .expect(404)
    .end((err, res) => {
      if (err) return t.fail(err)
      t.pass()
    })
})

test('GET to /services/crime-incidents returns service object', (t) => {
  t.plan(1)
  request(router)
    .get('/services/crime-incidents')
    .expect(200)
    .expect('Content-type', 'application/json')
    .end((err, res) => {
      if (err) return t.fail(err)
      t.equal(res.body.slug, 'crime-incidents', 'slug is crime-incidents')
    })
})

test('GET to /services/crime-incidents/queries returns list of queries', (t) => {
  t.plan(4)
  request(router)
    .get('/services/crime-incidents/queries')
    .expect(200)
    .expect('Content-type', 'application/json')
    .end((err, res) => {
      if (err) return t.fail(err)
      t.ok(Array.isArray(res.body), 'response is an array')
      t.ok(res.body[0].query_id, 'query_id property exists')
      t.ok(res.body[0].query, 'query property exists')
      t.ok(res.body[0].service_id, 'service_id property exists')
    })
})

test('GET to /services/crime-incidents/subscribers returns list of subscribers', (t) => {
  t.plan(3)
  request(router)
    .get('/services/crime-incidents/subscribers')
    .expect(200)
    .expect('Content-type', 'application/json')
    .end((err, res) => {
      if (err) return t.fail(err)
      t.ok(Array.isArray(res.body), 'response is array')
      t.ok(res.body[0].subscriber_id, 'subscriber_id property exists')
      t.ok(res.body[0].email, 'email property exists')
    })
})

test('POST to /services/crime-incidents/subscribers returns 200', (t) => {
  t.plan(1)
  request(router)
    .post('/services/crime-incidents/subscribers')
    .send({ email: 'foo@bar.com', query: 'q=test' })
    .expect(200)
    .end((err, res) => {
      if (err) return t.fail(err)
      t.pass('success')
    })
})

test('GET to /unknown returns 404', (t) => {
  t.plan(1)
  request(router)
    .get('/unknown')
    .expect(404)
    .end((err, res) => {
      if (err) return t.fail(err)
      t.pass('not found')
    })
})
