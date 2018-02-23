import snakeCaseKeys from 'snakecase-keys'
import camelCaseKeys from 'camelcase-keys'

const fetchOpts = {
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json'
  }
}

export function getServices () {
  return fetch('/api/services', fetchOpts)
    .then((res) => res.json())
    .then((services) => services.map(camelCaseKeys))
}

export function getService (slug) {
  return fetch(`/api/services/${slug}`, fetchOpts)
    .then((res) => res.json())
    .then((service) => camelCaseKeys(service))
}

export function logout () {
  const opts = { ...fetchOpts, method: 'POST' }
  return fetch('/api/logout', opts)
}

export function createService (payload) {
  const payloadSnakeKeys = snakeCaseKeys(payload)
  const body = JSON.stringify(payloadSnakeKeys)
  const opts = { ...fetchOpts, method: 'POST', body }
  return fetch('/api/services', opts)
    .then((res) => res.json())
}

export function updateService (slug, payload) {
  const payloadSnakeKeys = snakeCaseKeys(payload)
  const body = JSON.stringify(payloadSnakeKeys)
  const opts = { ...fetchOpts, method: 'PATCH', body }
  console.log(opts)
  return fetch(`/api/services/${slug}`, opts)
    .then((res) => res.json())
}
