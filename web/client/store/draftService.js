export const state = () => ({
  sampleData: null,
  url: 'https://phl.carto.com/api/v2/sql?q=SELECT * FROM incidents_part1_part2 LIMIT 5',
  template: null,
  name: null,
  subjectTemplate: null,
  endpoint: null
})

export const mutations = {
  SET_URL (state, url) {
    state.url = url
  },
  SET_TEMPLATE (state, template) {
    state.template = template
  },
  SET_DETAILS (state, { name, subjectTemplate, endpoint }) {
    state.name = name
    state.subjectTemplate = subjectTemplate
    state.endpoint = endpoint
  },
  RESET (currentState) {
    const defaultState = state()
    currentState.sampleData = defaultState.sampleData
    currentState.url = defaultState.url
    currentState.template = defaultState.template
  }
}
