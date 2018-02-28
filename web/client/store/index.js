import localForage from 'localforage'
import Api from '~/api'

const api = new Api()

export const state = () => ({
  user: {},
  services: [],
  currentService: {},
  draftService: {}
})

export const getters = {
  isLoggedIn: (state) => !!state.user.nickname
}

export const mutations = {
  SET_USER (state, user) {
    state.user = user
  },
  SET_SERVICES (state, services) {
    state.services = services
  },
  SET_CURRENT_SERVICE (state, service) {
    state.currentService = service
  },
  RESET_CURRENT_SERVICE (state) {
    state.currentService = {}
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
  async deleteService ({ commit }, slug) {
    await api.deleteService(slug)
    commit('RESET_CURRENT_SERVICE')
  },
  async logout ({ commit }) {
    await api.logout()
    commit('SET_USER', {})
  },
  async stashDraftService (ctx, draftService) {
    await localForage.setItem('draftService', draftService)
  },
  async removeStashedDraftService ({ commit }) {
    await localForage.removeItem('draftService')
  },
  async loadStashedDraftService ({ commit }) {
    return await localForage.getItem('draftService')
  }
}
