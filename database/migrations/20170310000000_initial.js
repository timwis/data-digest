exports.up = function (knex) {
  return knex.schema
    .createTable('services', (table) => {
      table.text('id').primary()
      table.string('name')
      table.string('slug')
      table.string('endpoint')
      table.string('subject_template')
      table.text('body_template')
    })
    .createTable('queries', (table) => {
      table.increments('id').primary()
      table.text('service_id').references('services.id').onDelete('CASCADE')
      table.string('url')
    })
    .createTable('subscribers', (table) => {
      table.increments('id').primary()
      table.string('email')
      table.integer('query_id').references('queries.id').onDelete('CASCADE')
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTable('services')
    .dropTable('queries')
    .dropTable('subscribers')
}
