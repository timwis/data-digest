const test = require('ava')
const find = require('lodash/find')
const knex = require('knex')

const {getUniqueQueries} = require('../workers/main')
const seed = require('../seeds/seed')

async function createDatabase () {
  const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { directory: __dirname + '/../migrations' },
    useNullAsDefault: true
  })
  await db.migrate.latest()
  await seed(db)
  return db
}

test('getUniqueQueries gets unique queries with all emails', async (t) => {
  const db = await createDatabase()
  const queries = await getUniqueQueries(db)

  t.is(queries.length, 2, 'number of queries')
  const crimeQuery = find(queries, (query) => query.url.includes('pol_incidents_part1_part2'))
  t.is(crimeQuery.emails.length, 2, 'crime query has 2 emails')
})
