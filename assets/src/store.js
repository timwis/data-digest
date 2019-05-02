import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { getField, updateField } from 'vuex-map-fields'
import createPersistedState from 'vuex-persistedstate'
import snakeCaseKeys from 'snakecase-keys'
import camelCaseKeys from 'camelcase-keys'
import omit from 'lodash/omit'

Vue.use(Vuex)
const api = axios.create({
  withCredentials: true
})

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState({
    paths: [
      'currentUser',
      'digest',
      'isDigestPendingCreation'
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
    isDigestPendingCreation: false
  },
  getters: {
    getField
  },
  mutations: {
    updateField,
    SET_DIGEST (state, digest) {
      state.digest = digest
    },
    PATCH_DIGEST (state, patch) {
      Object.assign(state.digest, patch)
    },
    SET_CURRENT_USER (state, currentUser) {
      state.currentUser = currentUser
    },
    RESET_CURRENT_USER (state) {
      state.currentUser = {}
    },
    SET_DIGEST_PENDING_CREATION (state, newValue) {
      state.isDigestPendingCreation = newValue
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
    async createDigest ({ commit, state }) {
      const digest = snakeCaseKeys(state.digest)
      const response = await api.post('/api/digests', { digest })
      const newDigest = camelCaseKeys(response.data.data)
      commit('SET_DIGEST', newDigest)
    },
    async showDigest ({ commit }, id) {
      const response = await api.get(`/api/digests/${id}`)
      const digest = camelCaseKeys(response.data.data)
      commit('SET_DIGEST', digest)
    },
    async updateDigest ({ commit, state }, id) {
      const digest = snakeCaseKeys(omit(state.digest, ['id']))
      const response = await api.put(`/api/digests/${id}`, { digest })
      const newDigest = camelCaseKeys(response.data.data)
      commit('SET_DIGEST', newDigest)
    }
  }
})
