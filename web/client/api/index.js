const fetchOpts = { credentials: 'same-origin' }

export function getServices () {
  return fetch('/api/services', fetchOpts)
    .then((res) => res.json())
}

export function logout () {
  const opts = { ...fetchOpts, method: 'POST' }
  return fetch('/api/logout', opts)
}
