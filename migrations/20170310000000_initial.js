exports.up = function (knex, Promise) {
  return knex.schema
    .createTable('services', (table) => {
      table.integer('service_id').primary()
      table.string('name')
      table.string('slug')
      table.string('endpoint')
      table.text('template')
    })
    .createTable('queries', (table) => {
      table.increments('query_id').primary()
      table.integer('service_id').references('services.id')
      table.string('url')
    })
    .createTable('subscribers', (table) => {
      table.increments('subscriber_id').primary()
      table.string('email')
      table.integer('query_id').references('queries.id')
    })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTable('services')
    .dropTable('queries')
    .dropTable('subscribers')
}
