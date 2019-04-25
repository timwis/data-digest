import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState({
    paths: ['user', 'digest']
  })],
  state: {
    user: {},
    digest: {
      name: null,
      sampleUrl: null,
      subjectTemplate: null,
      bodyTemplate: null,
      endpointTemplate: null
    }
  },
  getters: {
    getField
  },
  mutations: {
    updateField,
    PATCH_DIGEST (state, patch) {
      Object.assign(state.digest, patch)
    }
  },
  actions: {

  }
})
