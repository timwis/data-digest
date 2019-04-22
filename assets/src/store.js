import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
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
