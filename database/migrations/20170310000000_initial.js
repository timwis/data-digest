exports.up = function (knex) {
  return knex.schema
    .createTable('services', (table) => {
      table.text('id').primary()
      table.string('user_id') // references auth0
      table.string('name')
      table.string('slug')
      table.string('endpoint')
      table.string('sample_url')
      table.string('subject_template')
      table.text('body_template')
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('queries', (table) => {
      table.increments('id').primary()
      table.text('service_id').references('services.id').onDelete('CASCADE')
      table.string('url')
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('subscribers', (table) => {
      table.increments('id').primary()
      table.string('email')
      table.integer('query_id').references('queries.id').onDelete('CASCADE')
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTable('services')
    .dropTable('queries')
    .dropTable('subscribers')
}
