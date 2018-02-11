const yaml = require('js-yaml')
const fs = require('fs')
const assert = require('assert')
const { join } = require('path')

const filepath = join(__dirname, 'sample_data.yml')

exports.seed = async function (db) {
  assert(fs.existsSync(filepath), `File '${filepath}' not found`)

  const file = fs.readFileSync(filepath, 'utf8')
  const data = yaml.safeLoad(file)
  const tables = Object.keys(data)

  for (let table of tables) {
    await db(table).del()
    await db(table).insert(data[table])
  }
}
