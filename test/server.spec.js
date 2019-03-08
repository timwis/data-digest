const request = require('supertest')
const knex = require('knex')
const Cookie = require('tough-cookie').Cookie

const NODE_ENV = process.env.NODE_ENV || 'test'
const dbConfig = require('../knexfile')[NODE_ENV]
const createServer = require('../web/server')

const serviceKeys = ['id', 'user_id', 'name', 'slug', 'endpoint', 'sample_url', 'subject_template', 'body_template', 'created_at']
const subscriberKeys = ['id', 'email', 'query_id', 'query_url', 'created_at']
const sampleId = 'eWRhpRV'
const sampleSlug = `crime-incidents-${sampleId}`
const sampleUserId = `tester|tester`
const sampleSlugOtherUser = `other-users-service-23TplPdS`
const sampleSubscriberId = 1
const sampleSubscriberIdOtherUser = 5

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

    it('only returns services owned by logged-in user', async () => {
      const cookie = await getAuthCookie(server.callback())
      await request(server.callback())
        .get('/api/services')
        .set('Cookie', cookie)
        .expect(200)
        .then((res) => {
          res.body.forEach((service) => expect(service.user_id).toBe(sampleUserId))
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

    it('generates an id and slug from the name', async () => {
      const cookie = await getAuthCookie(server.callback())
      const payload = {
        name: 'Test service',
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
          const id = res.body.id
          expect(id.length).toBeGreaterThanOrEqual(6)
          expect(res.body.slug).toBe(`test-service-${id}`)
        })
    })

    it('saves logged-in user to user_id field', async () => {
      const cookie = await getAuthCookie(server.callback())
      const payload = {
        name: 'Test service',
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
          expect(res.body.user_id).toBe(sampleUserId)
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
        .get(`/api/services/${sampleSlug}`)
        .expect(401)
    })

    it('returns service object', async () => {
      const cookie = await getAuthCookie(server.callback())
      await request(server.callback())
        .get(`/api/services/${sampleSlug}`)
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

    it('returns 401 on service belonging to another user', async () => {
      const cookie = await getAuthCookie(server.callback())
      await request(server.callback())
        .get(`/api/services/${sampleSlugOtherUser}`)
        .set('Cookie', cookie)
        .expect(401)
    })
  })

  describe('PATCH to /services/:service', () => {
    it('requires authentication', async () => {
      await request(server.callback())
        .patch(`/api/services/${sampleSlug}`)
        .expect(401)
    })

    it('returns service object', async () => {
      const cookie = await getAuthCookie(server.callback())
      const payload = {
        subject_template: 'Changed subject'
      }
      await request(server.callback())
        .patch(`/api/services/${sampleSlug}`)
        .set('Cookie', cookie)
        .send(payload)
        .expect(200)
        .then((res) => {
          const actualKeys = Object.keys(res.body)
          expect(actualKeys).toEqual(serviceKeys)
          expect(res.body.subject_template).toBe('Changed subject')
        })
    })

    it('updates slug if name changes', async () => {
      const cookie = await getAuthCookie(server.callback())
      const payload = {
        name: 'Changed name'
      }
      await request(server.callback())
        .patch(`/api/services/${sampleSlug}`)
        .set('Cookie', cookie)
        .send(payload)
        .expect(200)
        .then((res) => {
          expect(res.body.slug).toBe(`changed-name-${sampleId}`)
        })
    })

    it(`doesn't allow unknown properties`, async () => {
      const cookie = await getAuthCookie(server.callback())
      const payload = {
        subject_template: 'Changed subject',
        unknown: 'unknown'
      }
      await request(server.callback())
        .patch(`/api/services/${sampleSlug}`)
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

    it('returns 401 on service belonging to another user', async () => {
      const cookie = await getAuthCookie(server.callback())
      const payload = {
        subject_template: 'Changed subject'
      }
      await request(server.callback())
        .patch(`/api/services/${sampleSlugOtherUser}`)
        .set('Cookie', cookie)
        .send(payload)
        .expect(401)
    })
  })

  describe('DELETE to /services/:service', () => {
    it('requires authentication', async () => {
      await request(server.callback())
        .delete(`/api/services/${sampleSlug}`)
        .expect(401)
    })

    it('returns 204 on success', async () => {
      const cookie = await getAuthCookie(server.callback())
      await request(server.callback())
        .delete(`/api/services/${sampleSlug}`)
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

    it('returns 401 on service belonging to another user', async () => {
      const cookie = await getAuthCookie(server.callback())
      await request(server.callback())
        .delete(`/api/services/${sampleSlugOtherUser}`)
        .set('Cookie', cookie)
        .expect(401)
    })
  })

  describe('GET to /services/:service/subscribers', () => {
    it('requires authentication', async () => {
      await request(server.callback())
        .get(`/api/services/${sampleSlug}/subscribers`)
        .expect(401)
    })

    it('returns 200 and list of subscribers', async () => {
      const cookie = await getAuthCookie(server.callback())
      await request(server.callback())
        .get(`/api/services/${sampleSlug}/subscribers`)
        .set('Cookie', cookie)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true)
          const item = res.body[0]
          const actualKeys = Object.keys(item)
          expect(actualKeys).toEqual(subscriberKeys)
        })
    })

    it('returns 401 on service belonging to another user', async () => {
      const cookie = await getAuthCookie(server.callback())
      await request(server.callback())
        .get(`/api/services/${sampleSlugOtherUser}/subscribers`)
        .set('Cookie', cookie)
        .expect(401)
    })
  })

  describe('POST to /services/:service/subscribers', () => {
    it('returns 201 and object for new subscription', async () => {
      const query = 'SELECT * FROM foo'
      const payload = { // already exists in seed data
        email: 'foo@foo.foo',
        url: `https://phl.carto.com/api/v2/sql?q=${encodeURIComponent(query)}`
      }
      await request(server.callback())
        .post(`/api/services/${sampleSlug}/subscribers`)
        .send(payload)
        .expect(201)
        .then((res) => {
          const actualKeys = Object.keys(res.body)
          expect(actualKeys).toEqual(subscriberKeys)
        })
    })

    it('returns 200 and object for existing subscription', async () => {
      const payload = { // already exists in seed data
        email: 'data-digest-d@mailinator.com',
        url: `https://phl.carto.com/api/v2/sql?q=SELECT+1`
      }
      await request(server.callback())
        .post(`/api/services/${sampleSlug}/subscribers`)
        .send(payload)
        .expect(200)
        .then((res) => {
          const actualKeys = Object.keys(res.body)
          expect(actualKeys).toEqual(subscriberKeys)
        })
    })

    it('returns 422 for invalid url', async () => {
      const payload = {
        email: 'foo@foo.com',
        url: `http://invalid.com`
      }
      await request(server.callback())
        .post(`/api/services/${sampleSlug}/subscribers`)
        .send(payload)
        .expect(422)
    })
  })

  describe('DELETE to /services/:service/subscribers/:subscriber', () => {
    it('requires authentication', async () => {
      await request(server.callback())
        .delete(`/api/services/${sampleSlug}/subscribers/${sampleSubscriberId}`)
        .expect(401)
    })

    it('returns 401 on service belonging to another user', async () => {
      const cookie = await getAuthCookie(server.callback())
      await request(server.callback())
        .delete(`/api/services/${sampleSlugOtherUser}/subscribers/${sampleSubscriberIdOtherUser}`)
        .set('Cookie', cookie)
        .expect(401)
    })

    it('returns 404 on subscriber of wrong service', async () => {
      const cookie = await getAuthCookie(server.callback())
      await request(server.callback())
        .delete(`/api/services/${sampleSlug}/subscribers/${sampleSubscriberIdOtherUser}`)
        .set('Cookie', cookie)
        .expect(404)
    })

    it('returns 204 on success', async () => {
      const cookie = await getAuthCookie(server.callback())
      await request(server.callback())
        .delete(`/api/services/${sampleSlug}/subscribers/${sampleSubscriberId}`)
        .set('Cookie', cookie)
        .expect(204)
    })
  })
})

async function getAuthCookie (server) {
  return await request(server)
    .post('/callback-test')
    .then((res) => {
      const cookies = res.headers['set-cookie'][0].split(',') // superagent bug?
      return cookies
        .map(Cookie.parse)
        .map((parsedCookie) => parsedCookie.cookieString())
        .join(';')
    })
}
