const test = require('ava')
const find = require('lodash/find')

const nodeEnv = process.env.NODE_ENV || 'development'
const dbConfig = require('../knexfile')[nodeEnv]
const db = require('knex')(dbConfig)

const {getUniqueQueries} = require('../workers/main')

test('getUniqueQueries gets unique queries with all emails', async (t) => {
  const queries = await getUniqueQueries(db)

  t.is(queries.length, 2, 'number of queries') // another test makes this fail
  const crimeQuery = find(queries, (query) => query.query.includes('pol_incidents_part1_part2'))
  t.is(crimeQuery.emails.length, 2, 'crime query has 2 emails')
})
