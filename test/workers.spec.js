const test = require('ava')
const find = require('lodash/find')
const knex = require('knex')

const {getUniqueQueries} = require('../workers/main')

async function createDatabase () {
  const db = knex({
    client: 'sqlite3',
    connection: { filename: ':memory:' },
    migrations: { directory: __dirname + '/../migrations' },
    seeds: {directory: __dirname + '/../seeds' },
    useNullAsDefault: true
  })
  await db.migrate.latest()
  await db.seed.run()
  return db
}

test('getUniqueQueries gets unique queries with all emails', async (t) => {
  const db = await createDatabase()
  const queries = await getUniqueQueries(db)

  t.is(queries.length, 2, 'number of queries') // another test makes this fail
  const crimeQuery = find(queries, (query) => query.query.includes('pol_incidents_part1_part2'))
  t.is(crimeQuery.emails.length, 2, 'crime query has 2 emails')
})
