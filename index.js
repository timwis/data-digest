const nodeEnv = process.env.NODE_ENV || 'development'
const dbConfig = require('./knexfile')[nodeEnv]

const knex = require('knex')[dbConfig]
const request = require('request')
const fs = require('fs')

const response = fs.readFile('./test/fixtures/crimes.json')
response.then((contents) => console.log(contents))
  .catch((err) => console.error(err))
