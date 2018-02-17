const request = require('supertest')
const knex = require('knex')
const Cookie = require('tough-cookie').Cookie

const NODE_ENV = process.env.NODE_ENV || 'test'
const dbConfig = require('../knexfile')[NODE_ENV]
const createServer = require('../web/server')

const serviceKeys = ['id', 'name', 'slug', 'endpoint', 'subject_template', 'body_template']

describe('Web server', () => {
  let server, db

  beforeEach(async () => {
    db = knex(dbConfig)
    await db.migrate.latest()
    await db.seed.run()
    server = await createServer(db)
  })

  afterEach(() => db.destroy())

  describe('GET to /services', () => {
    it('requires authentication', async () => {
      await request(server.callback())
        .get('/api/services')
        .expect(401)
    })

    it('returns 200 and list', async () => {
      const cookie = await getAuthCookie(server.callback())
      await request(server.callback())
        .get('/api/services')
        .set('Cookie', cookie)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true)
        })
    })
  })

  describe('POST to /services', () => {
    it('requires authentication', async () => {
      await request(server.callback())
        .post('/api/services')
        .expect(401)
    })

    it('returns 201 and service object on success', async () => {
      const cookie = await getAuthCookie(server.callback())
      const payload = {
        name: 'Test service',
        slug: 'test-service',
        endpoint: 'http://endpoint.com',
        subject_template: 'Daily test service',
        body_template: 'Here is your test data'
      }
      await request(server.callback())
        .post('/api/services')
        .set('Cookie', cookie)
        .send(payload)
        .expect(201)
        .then((res) => {
          expect(res.body).toMatchObject(payload)
        })
    })

    it('returns 422 on missing fields', async () => {
      const cookie = await getAuthCookie(server.callback())
      const payload = {
        name: 'Test service'
      }
      await request(server.callback())
        .post('/api/services')
        .set('Cookie', cookie)
        .send(payload)
        .expect(422)
    })

    it.skip(`doesn't allow duplicate slugs`)
  })

  describe('GET to /services/:service', () => {
    it('requires authentication', async () => {
      await request(server.callback())
        .get('/api/services/crime-incidents')
        .expect(401)
    })

    it('returns service object', async () => {
      const cookie = await getAuthCookie(server.callback())
      await request(server.callback())
        .get('/api/services/crime-incidents')
        .set('Cookie', cookie)
        .expect(200)
        .then((res) => {
          const actualKeys = Object.keys(res.body)
          expect(actualKeys).toEqual(serviceKeys)
        })
    })

    it('returns 404 on unknown service', async () => {
      const cookie = await getAuthCookie(server.callback())
      await request(server.callback())
        .get('/api/services/unknown')
        .set('Cookie', cookie)
        .expect(404)
    })
  })

  describe('PATCH to /services/:service', () => {
    it('requires authentication', async () => {
      await request(server.callback())
        .patch('/api/services/crime-incidents')
        .expect(401)
    })

    it('returns service object', async () => {
      const cookie = await getAuthCookie(server.callback())
      const payload = {
        subject_template: 'Changed subject'
      }
      await request(server.callback())
        .patch('/api/services/crime-incidents')
        .set('Cookie', cookie)
        .send(payload)
        .expect(200)
        .then((res) => {
          const actualKeys = Object.keys(res.body)
          expect(actualKeys).toEqual(serviceKeys)
          expect(res.body.subject_template).toBe('Changed subject')
        })
    })

    it(`doesn't allow unknown properties`, async () => {
      const cookie = await getAuthCookie(server.callback())
      const payload = {
        subject_template: 'Changed subject',
        unknown: 'unknown'
      }
      await request(server.callback())
        .patch('/api/services/crime-incidents')
        .set('Cookie', cookie)
        .send(payload)
        .expect(422)
    })

    it('returns 404 on unknown service', async () => {
      const cookie = await getAuthCookie(server.callback())
      const payload = {
        subject_template: 'Changed subject'
      }
      await request(server.callback())
        .patch('/api/services/unknown')
        .set('Cookie', cookie)
        .send(payload)
        .expect(404)
    })
  })

  describe('DELETE to /services/:service', () => {
    it('requires authentication', async () => {
      await request(server.callback())
        .delete('/api/services/crime-incidents')
        .expect(401)
    })

    it('returns 204 on success', async () => {
      const cookie = await getAuthCookie(server.callback())
      await request(server.callback())
        .delete('/api/services/crime-incidents')
        .set('Cookie', cookie)
        .expect(204)
    })

    it('returns 404 on unknown service', async () => {
      const cookie = await getAuthCookie(server.callback())
      await request(server.callback())
        .delete('/api/services/unknown')
        .set('Cookie', cookie)
        .expect(404)
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

async function getAuthCookie (server) {
  return await request(server)
    .post('/api/authenticate-test')
    .then((res) => {
      const cookies = res.headers['set-cookie'][0].split(',') // superagent bug?
      return cookies
        .map(Cookie.parse)
        .map((parsedCookie) => parsedCookie.cookieString())
        .join(';')
    })
}
