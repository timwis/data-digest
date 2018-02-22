import * as api from '~/api'

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
  async logout ({ commit }) {
    await api.logout()
    commit('SET_USER', {})
  }
}
