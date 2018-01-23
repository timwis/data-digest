const schemas = {
  service: {
    name: { type: 'string' },
    slug: { type: 'string' },
    endpoint: { type: 'string', format: 'regex' },
    subject_template: { type: 'string' },
    body_template: { type: 'string' }
  },
  subscriber: {
    url: { type: 'string' },
    email: { type: 'string', format: 'email' }
  }
}

const ALL = Symbol('all properties')

module.exports = {
  service: {
    create: wrap(schemas.service, ALL)
  },
  subscriber: {
    create: wrap(schemas.subscriber, ALL)
  }
}

function wrap (properties, requiredFields) {
  const required = (requiredFields === ALL)
    ? Object.keys(properties)
    : requiredFields

  return {
    body: {
      type: 'object',
      properties,
      required
    }
  }
}
