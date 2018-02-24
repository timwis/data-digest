import snakeCaseKeys from 'snakecase-keys'
import camelCaseKeys from 'camelcase-keys'
import axios from 'axios'

export default class Api {
  constructor (baseURL) {
    this.client = axios.create({
      baseURL,
      withCredentials: true
    })
  }

  getServices () {
    return this.client.get('/api/services')
      .then((res) => res.data)
      .then((services) => services.map(camelCaseKeys))
  }

  getService (slug) {
    return this.client.get(`/api/services/${slug}`)
      .then((res) => res.data)
      .then(camelCaseKeys)
  }

  logout () {
    return this.client.post('/api/logout')
  }

  createService (payload) {
    const payloadSnakeKeys = snakeCaseKeys(payload)
    return this.client.post('/api/services', payloadSnakeKeys)
      .then((res) => res.data)
      .then(camelCaseKeys)
  }

  updateService (slug, payload) {
    const payloadSnakeKeys = snakeCaseKeys(payload)
    return this.client.patch(`/api/services/${slug}`, payloadSnakeKeys)
      .then((res) => res.data)
      .then(camelCaseKeys)
  }
}
