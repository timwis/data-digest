import snakeCaseKeys from 'snakecase-keys'

const fetchOpts = { credentials: 'same-origin' }

export function getServices () {
  return fetch('/api/services', fetchOpts)
    .then((res) => res.json())
}

export function getService (slug) {
  return fetch(`/api/services/${slug}`, fetchOpts)
    .then((res) => res.json())
}

export function logout () {
  const opts = { ...fetchOpts, method: 'POST' }
  return fetch('/api/logout', opts)
}

export function createService (payload) {
  const payloadSnakeKeys = snakeCaseKeys(payload)
  const body = JSON.stringify(payloadSnakeKeys)
  const headers = { 'Content-Type': 'application/json' }
  const opts = { ...fetchOpts, method: 'POST', headers, body }
  return fetch('/api/services', opts)
    .then((res) => res.json())
}
