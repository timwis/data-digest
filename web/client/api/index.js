const fetchOpts = { credentials: 'same-origin' }

export function getServices () {
  return fetch('/api/services', fetchOpts)
    .then((res) => res.json())
}
