import Vuex from 'vuex'

import * as api from '~/api'

const createStore = () => new Vuex.Store({
  state: {
    user: {},
    services: []
  },
  mutations: {
    SET_USER (state, user) {
      state.user = user
    },
    SET_SERVICES (state, services) {
      state.services = services
    }
  },
  actions: {
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
})

export default createStore
