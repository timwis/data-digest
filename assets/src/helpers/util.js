export function mapNestedFields (source, mappings) {
  return Object.entries(mappings).reduce((accum, [localKey, sourceKey]) => {
    accum[localKey] = {
      get () {
        return this[source][sourceKey]
      },
      set (newValue) {
        this[source] = Object.assign({}, this[source], { [sourceKey]: newValue })
      }
    }
    return accum
  }, {})
}
