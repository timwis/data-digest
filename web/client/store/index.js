import * as api from '~/api'

export const state = () => ({
  user: {},
  services: []
})

export const mutations = {
  SET_USER (state, user) {
    state.user = user
  },
  SET_SERVICES (state, services) {
    state.services = services
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    if (req.state.user) commit('SET_USER', req.state.user)
  },
  async getServices ({ commit }) {
    const services = await api.getServices()
    commit('SET_SERVICES', services)
  },
  async logout ({ commit }) {
    await api.logout()
    commit('SET_USER', {})
  }
}
