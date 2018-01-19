const yaml = require('js-yaml')
const fs = require('fs')
const assert = require('assert')

module.exports = seed
if (!module.parent) {
  const nodeEnv = process.env.NODE_ENV || 'development'
  const dbConfig = require('../knexfile')[nodeEnv]
  const db = require('knex')(dbConfig)
  seed(db).then(() => db.destroy())
}

async function seed (db) {
  try {
    const filepath = process.argv[2]
    const tables = process.argv.slice(3)
    assert(filepath, `No file path specified`)
    assert(fs.existsSync(filepath), `File '${filepath}' not found`)
    assert(tables.length > 0, `No tables specified`)

    const file = fs.readFileSync(filepath, 'utf8')
    const data = yaml.safeLoad(file)

    for (let table of tables) {
      await db(table).del()
      await db(table).insert(data[table])
      console.log(`Loaded ${table}`)
    }
  } catch (err) {
    console.error(err.message)
  }
}
