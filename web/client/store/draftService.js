export const state = () => ({
  sampleData: null,
  url: 'https://phl.carto.com/api/v2/sql?q=SELECT * FROM incidents_part1_part2 LIMIT 5',
  template: null
})

export const mutations = {
  SET_URL (state, url) {
    state.url = url
  },
  SET_TEMPLATE (state, template) {
    state.template = template
  },
  RESET (currentState) {
    const defaultState = state()
    currentState.sampleData = defaultState.sampleData
    currentState.url = defaultState.url
    currentState.template = defaultState.template
  }
}
