const test = require('ava')

const { formatDateHelper } = require('../util')
const format = require('date-fns/format')
const subDays = require('date-fns/sub_days')

test('parses and formats yesterday', (t) => {
  const result = formatDateHelper('yesterday', 'YYYY-MM-DD')
  const yesterday = subDays(new Date(), 1)
  const expected = format(yesterday, 'YYYY-MM-DD')
  t.is(result, expected)
})
