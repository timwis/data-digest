const { superstruct } = require('superstruct')

const struct = superstruct({
  types: {
    regex: (value) => {
      try {
        new RegExp(value) // eslint-disable-line
        return true
      } catch (err) {
        return false
      }
    }
  }
})

const Service = {
  name: 'string',
  slug: 'string',
  endpoint: 'regex',
  subject_template: 'string',
  body_template: 'string'
}

module.exports = {
  service: {
    create: struct(Service),
    update: struct.optional(Service)
  }
}
