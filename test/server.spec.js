const test = require('ava')
const request = require('supertest')
const knex = require('knex')

const createServer = require('../server/server')

async function createDatabase () {
  const db = knex({
    client: 'sqlite3',
    connection: { filename: ':memory:' },
    migrations: { directory: __dirname + '/../migrations' },
    seeds: {directory: __dirname + '/../seeds' },
    useNullAsDefault: true
  })
  await db.migrate.latest()
  await db.seed.run()
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

test('POST to /services/crime-incidents/subscribers returns 200 or 201', async (t) => {
  const db = await createDatabase()
  const server = createServer(db)
  return request(server)
    .post('/services/crime-incidents/subscribers')
    .send({ email: 'foo@bar.com', url: 'q=test' })
    .then((res) => {
      t.true((res.statusCode === 200 || res.statusCode === 201), 'status code is 200 or 201')
    })
})

test('GET to /unknown returns 404', (t) => {
  const server = createServer()
  return request(server)
    .get('/unknown')
    .expect(404)
})
