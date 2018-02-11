const { formatDateHelper } = require('../util')
const format = require('date-fns/format')
const subDays = require('date-fns/sub_days')

describe('Utilities', () => {
  it('parses and formats yesterday', () => {
    const result = formatDateHelper('yesterday', 'YYYY-MM-DD')
    const yesterday = subDays(new Date(), 1)
    const expected = format(yesterday, 'YYYY-MM-DD')
    expect(result).toBe(expected)
  })
})
