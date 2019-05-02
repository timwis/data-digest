import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
import snakeCaseKeys from 'snakecase-keys'
import camelCaseKeys from 'camelcase-keys'

Vue.use(Vuex)
const api = axios.create({
  withCredentials: true
})

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState({
    paths: [
      'currentUser',
      'draftDigest'
    ]
  })],
  state: {
    currentUser: {},
    digest: {
      id: null,
      name: null,
      subjectTemplate: null,
      bodyTemplate: null,
      endpointTemplate: null
    },
    draftDigest: null
  },
  mutations: {
    SET_DIGEST (state, digest) {
      state.digest = digest
    },
    SET_CURRENT_USER (state, currentUser2) {
      state.currentUser = currentUser2
    },
    RESET_CURRENT_USER (state) {
      state.currentUser = {}
    },
    SET_DRAFT_DIGEST (state, draftDigest) {
      state.draftDigest = draftDigest
    },
    RESET_DRAFT_DIGEST (state, draftDigest) {
      state.draftDigest = null
    }
  },
  actions: {
    async getCurrentUser ({ commit }) {
      try {
        const response = await api.get('/auth')
        if (response.data.data) {
          commit('SET_CURRENT_USER', response.data.data)
        } else {
          commit('RESET_CURRENT_USER')
        }
      } catch (err) {
        commit('RESET_CURRENT_USER')
      }
    },
    async logout ({ commit }) {
      await api.post('/auth/logout')
      commit('RESET_CURRENT_USER')
    },
    async createDigest ({ commit }, payload) {
      const digest = snakeCaseKeys(payload)
      const response = await api.post('/api/digests', { digest })
      const newDigest = camelCaseKeys(response.data.data)
      commit('SET_DIGEST', newDigest)
      return newDigest // used by view to redirect
    },
    async showDigest ({ commit }, id) {
      const response = await api.get(`/api/digests/${id}`)
      const digest = camelCaseKeys(response.data.data)
      commit('SET_DIGEST', digest)
    },
    async patchDigest ({ commit, state }, { id, payload }) {
      const digest = snakeCaseKeys({ ...state.digest, ...payload })
      const response = await api.put(`/api/digests/${id}`, { digest })
      const newDigest = camelCaseKeys(response.data.data)
      commit('SET_DIGEST', newDigest)
    }
  }
})
