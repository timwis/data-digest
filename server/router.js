const Router = require('koa-router')
const validate = require('koa-superstruct')
const schemas = require('./schemas')

const router = new Router({ prefix: '/api' })
module.exports = router

router.get(
  '/services',
  async function (ctx) {
    ctx.body = await getServices(ctx.db)
  }
)

router.post(
  '/services',
  validate(schemas.service.create),
  async function (ctx) {
    const payload = ctx.request.body
    ctx.body = await createService(ctx.db, payload)
    ctx.status = 201
  }
)

router.get(
  '/services/:serviceSlug',
  async function (ctx) {
    console.log('getting service')
    const { serviceSlug } = ctx.params
    const services = await getServicesBySlug(ctx.db, serviceSlug)
    if (services.length === 0) ctx.throw(404)
    ctx.body = services[0]
    ctx.status = 200
  }
)

function getServices (db) {
  return db('services')
}

async function createService (db, payload) {
  const [ serviceId ] = await db('services').insert(payload)
  const [ service ] = await db('services').where('id', serviceId)
  return service
}

function getServicesBySlug (db, serviceSlug) {
  return db('services')
    .where('slug', serviceSlug)
}
