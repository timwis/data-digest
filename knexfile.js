// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },

  test: {
    client: 'sqlite3',
    connection: ':memory:'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
}
