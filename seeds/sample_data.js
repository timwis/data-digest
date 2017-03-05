exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('queries').del()
      .then(function () {
        return Promise.all([
          // Inserts seed entries
          knex('queries').insert({
            query_id: 1,
            query: 'sql=SELECT * FROM pol_incidents_part1_part2 WHERE dispatch_date_time >= current_date'
          }),
          knex('queries').insert({
            query_id: 2,
            query: 'sql=SELECT * FROM li_clean_seal WHERE actiondate >= current_date - 1'
          })
        ])
      }),
    knex('subscribers').del()
      .then(function () {
        return Promise.all([
          knex('subscribers').insert({
            subscriber_id: 1,
            query_id: 1,
            email: 'a@a.com'
          }),
          knex('subscribers').insert({
            subscriber_id: 2,
            query_id: 1,
            email: 'b@b.com'
          }),
          knex('subscribers').insert({
            subscriber_id: 3,
            query_id: 2,
            email: 'c@c.com'
          })
        ])
      }),
    knex('services').del()
      .then(knex('services').insert({
        service_id: 1,
        endpoint: 'https://phl.carto.com/api/v2/sql',
        template: '{{#each}}'
  ])
}
