const { superstruct } = require('superstruct')
const isEmail = require('is-email')
const isUrl = require('is-url')
const mapValues = require('lodash/mapValues')

const struct = superstruct({
  types: {
    regex: (value) => {
      try {
        new RegExp(value) // eslint-disable-line
        return true
      } catch (err) {
        return false
      }
    },
    email: (value) => isEmail(value) && value.length < 256,
    url: (value) => isUrl(value) && value.length < 2048
  }
})

const Service = {
  body: {
    name: 'string',
    endpoint: 'regex',
    sample_url: 'string?',
    subject_template: 'string',
    body_template: 'string'
  }
}

const Subscriber = {
  body: {
    email: 'email',
    url: 'url'
  }
}

module.exports = {
  service: {
    create: struct(Service),
    update: struct(makeOptional(Service))
  },
  subscriber: {
    create: struct(Subscriber)
  }
}

// Wrap 'string' etc. in struct.optional()
function makeOptional (Schema) {
  return mapValues(Schema, (definition) => {
    return mapValues(definition, (rule) => struct.optional(rule))
  })
}
