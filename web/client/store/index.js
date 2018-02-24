import Api from '~/api'

const HOSTNAME = process.env.HOSTNAME
const api = new Api(HOSTNAME)

export const state = () => ({
  user: {},
  services: [],
  currentService: {}
})

export const mutations = {
  SET_USER (state, user) {
    state.user = user
  },
  SET_SERVICES (state, services) {
    state.services = services
  },
  SET_CURRENT_SERVICE (state, service) {
    state.currentService = service
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    if (req.user) commit('SET_USER', req.user)
  },
  async getServices ({ commit }) {
    const services = await api.getServices()
    commit('SET_SERVICES', services)
  },
  async getService ({ commit }, slug) {
    const service = await api.getService(slug)
    commit('SET_CURRENT_SERVICE', service)
  },
  async createService (ctx, payload) {
    const service = await api.createService(payload)
    return service
  },
  async updateService ({ commit }, { slug, payload }) {
    const service = await api.updateService(slug, payload)
    commit('SET_CURRENT_SERVICE', service)
    return service
  },
  async logout ({ commit }) {
    await api.logout()
    commit('SET_USER', {})
  }
}
