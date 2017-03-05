exports.up = function (knex, Promise) {
  return knex.schema.createTable('queries', (table) => {
    table.increments('query_id').primary()
    table.string('query')
  })
  .createTable('subscribers', (table) => {
    table.increments('subscriber_id').primary()
    table.string('email')
    table.integer('query_id').references('queries.id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('queries')
    .dropTable('subscribers')
}
