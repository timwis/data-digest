import Vuex from 'vuex'

const createStore = () => new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    SET_USER (state, user) {
      state.user = user
    }
  },
  actions: {
    nuxtServerInit ({ commit }, { req }) {
      if (req.state.user) commit('SET_USER', req.state.user)
    }
  }
})

export default createStore
