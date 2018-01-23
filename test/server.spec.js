const test = require('ava')
const request = require('supertest')
const knex = require('knex')

const NODE_ENV = process.env.NODE_ENV || 'test'
const dbConfig = require('../knexfile')[NODE_ENV]
const createServer = require('../server/server')
const seed = require('../seeds/seed')

async function createDatabase () {
  const db = knex(dbConfig)
  await db.migrate.latest()
  await seed(db)
  return db
}

test('GET to /services/unknown returns 404', async (t) => {
  const db = await createDatabase()
  const server = createServer(db)
  return request(server)
    .get('/services/foo')
    .expect(404)
})

test('GET to /services/crime-incidents returns service object', async (t) => {
  const db = await createDatabase()
  const server = createServer(db)
  return request(server)
    .get('/services/crime-incidents')
    .expect(200)
    .expect('Content-type', 'application/json')
    .then((res) => {
      t.is(res.body.slug, 'crime-incidents', 'slug is crime-incidents')
    })
})

test('GET to /services/crime-incidents/queries returns list of queries', async (t) => {
  const db = await createDatabase()
  const server = createServer(db)
  return request(server)
    .get('/services/crime-incidents/queries')
    .expect(200)
    .expect('Content-type', 'application/json')
    .then((res) => {
      t.true(Array.isArray(res.body), 'response is an array')
      t.truthy(res.body[0].query_id, 'query_id property exists')
      t.truthy(res.body[0].url, 'url property exists')
      t.truthy(res.body[0].service_id, 'service_id property exists')
    })
})

test('GET to /services/crime-incidents/subscribers returns list of subscribers', async (t) => {
  const db = await createDatabase()
  const server = createServer(db)
  return request(server)
    .get('/services/crime-incidents/subscribers')
    .expect(200)
    .expect('Content-type', 'application/json')
    .then((res) => {
      t.true(Array.isArray(res.body), 'response is array')
      t.truthy(res.body[0].subscriber_id, 'subscriber_id property exists')
      t.truthy(res.body[0].email, 'email property exists')
    })
})

test('POST to /services/crime-incidents/subscribers returns 201 for new subscription', async (t) => {
  const db = await createDatabase()
  const server = createServer(db)
  const payload = { // already exists in seed data
    email: 'foo@foo.foo',
    url: 'https://phl.carto.com/api/v2/sql?q=SELECT * FROM foo'
  }
  return request(server)
    .post('/services/crime-incidents/subscribers')
    .send(payload)
    .then((res) => {
      t.is(res.statusCode, 201, 'status code is 201')
    })
})

test('POST to /services/crime-incidents/subscribers returns 200 for existing subscription', async (t) => {
  const db = await createDatabase()
  const server = createServer(db)
  const payload = { // already exists in seed data
    email: 'a@a.com',
    url: 'https://phl.carto.com/api/v2/sql?q=SELECT * FROM pol_incidents_part1_part2 WHERE dispatch_date_time >= \'2017-02-15\''
  }
  return request(server)
    .post('/services/crime-incidents/subscribers')
    .send(payload)
    .then((res) => {
      t.is(res.statusCode, 200, 'status code is 200')
    })
})

test('POST to /services/crime-incidents/subscribers returns 400 for invalid url', async (t) => {
  const db = await createDatabase()
  const server = createServer(db)
  const payload = { // already exists in seed data
    email: 'foo@bar.com',
    url: 'https://invalidurl.com'
  }
  return request(server)
    .post('/services/crime-incidents/subscribers')
    .send(payload)
    .then((res) => {
      t.is(res.statusCode, 400, 'status code is 400')
    })
})

test('GET to /unknown returns 404', (t) => {
  const server = createServer()
  return request(server)
    .get('/unknown')
    .expect(404)
})
