const request = require('supertest')
const knex = require('knex')

const NODE_ENV = process.env.NODE_ENV || 'test'
const dbConfig = require('../knexfile')[NODE_ENV]
const createServer = require('../server')

const serviceKeys = ['id', 'name', 'slug', 'endpoint', 'subject_template', 'body_template']

describe('Web server', () => {
  let server, db

  beforeEach(async () => {
    db = knex(dbConfig)
    await db.migrate.latest()
    await db.seed.run()
    server = createServer(db)
  })

  afterEach(() => db.destroy())

  describe('GET to /services', () => {
    it('returns 200 and list', async () => {
      await request(server.callback())
        .get('/api/services')
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true)
        })
    })
  })

  describe('POST to /services', () => {
    it('returns 201 and service object on success', async () => {
      const payload = {
        name: 'Test service',
        slug: 'test-service',
        endpoint: 'http://endpoint.com',
        subject_template: 'Daily test service',
        body_template: 'Here is your test data'
      }
      await request(server.callback())
        .post('/api/services')
        .send(payload)
        .expect(201)
        .then((res) => {
          expect(res.body).toMatchObject(payload)
        })
    })

    it('returns 422 on missing fields', async () => {
      const payload = {
        name: 'Test service'
      }
      await request(server.callback())
        .post('/api/services')
        .send(payload)
        .expect(422)
    })

    it.skip(`doesn't allow duplicate slugs`)
  })

  describe('GET to /services/:service', () => {
    it('returns service object', async () => {
      await request(server.callback())
        .get('/api/services/crime-incidents')
        .expect(200)
        .then((res) => {
          const actualKeys = Object.keys(res.body)
          expect(actualKeys).toEqual(serviceKeys)
        })
    })

    it('returns 404 on unknown service', async () => {
      await request(server.callback())
        .get('/api/services/unknown')
        .expect(404)
    })
  })

  describe('PATCH to /services/:service', () => {
    it('returns service object', async () => {
      const payload = {
        subject_template: 'Changed subject'
      }
      await request(server.callback())
        .patch('/api/services/crime-incidents')
        .send(payload)
        .expect(200)
        .then((res) => {
          console.log(res.text)
          const actualKeys = Object.keys(res.body)
          expect(actualKeys).toEqual(serviceKeys)
          expect(res.body.subject_template).toBe('Changed subject')
        })
    })
  })

  describe('POST to /services/crime-incidents/subscribers', () => {
    it('returns 201 for new subscription', async () => {
      const query = 'SELECT * FROM foo'
      const payload = { // already exists in seed data
        email: 'foo@foo.foo',
        url: `https://phl.carto.com/api/v2/sql?q=${encodeURIComponent(query)}`
      }
      await request(server.callback())
        .post('/api/services/crime-incidents/subscribers')
        .send(payload)
        .expect(201)
    })

    it('returns 200 for existing subscription', async () => {
      const payload = { // already exists in seed data
        email: 'subscribeme-d@mailinator.com',
        url: `https://phl.carto.com/api/v2/sql?q=SELECT+1`
      }
      await request(server.callback())
        .post('/api/services/crime-incidents/subscribers')
        .send(payload)
        .expect(200)
    })

    it('returns 422 for invalid url', async () => {
      const payload = {
        email: 'foo@foo.com',
        url: `http://invalid.com`
      }
      await request(server.callback())
        .post('/api/services/crime-incidents/subscribers')
        .send(payload)
        .expect(422)
    })
  })
})
