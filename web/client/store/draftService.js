export const state = () => ({
  sampleData: null,
  url: 'https://phl.carto.com/api/v2/sql?q=SELECT * FROM incidents_part1_part2 LIMIT 5',
  name: null,
  subjectTemplate: null,
  bodyTemplate: null,
  endpoint: null
})

export const mutations = {
  SET_URL (state, url) {
    state.url = url
  },
  SET_TEMPLATES (state, { subjectTemplate, bodyTemplate }) {
    state.subjectTemplate = subjectTemplate
    state.bodyTemplate = bodyTemplate
  },
  SET_DETAILS (state, { name, endpoint }) {
    state.name = name
    state.endpoint = endpoint
  },
  RESET (currentState) {
    const defaultState = state()
    const keys = Object.keys(defaultState)
    for (let key of keys) {
      currentState[key] = defaultState[key]
    }
  }
}
