exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('services', (table) => {
      table.integer('service_id').primary()
      table.string('name')
      table.string('slug')
      table.string('endpoint')
      table.text('template')
    }),
    knex.schema.table('queries', (table) => {
      table.integer('service_id').references('services.id')
    })
  ])
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('services')
}
