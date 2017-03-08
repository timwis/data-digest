exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('services').del()
      .then(function () {
        return Promise.all([
          knex('services').insert({
            service_id: 1,
            name: 'Crime incidents',
            slug: 'crime-incidents',
            endpoint: 'https://phl.carto.com/api/v2/sql',
            template: '<h1>Crime incidents</h1>{{#each response.rows}}<li>{{location_block}}</li>{{/each}}'
          })
        ])
      }),
    knex('queries').del()
      .then(function () {
        return Promise.all([
          // Inserts seed entries
          knex('queries').insert({
            query_id: 1,
            service_id: 1,
            query: 'q=SELECT * FROM pol_incidents_part1_part2 WHERE dispatch_date_time >= \'2017-02-15\''
          }),
          knex('queries').insert({
            query_id: 2,
            service_id: 1,
            query: 'q=SELECT * FROM li_clean_seal WHERE actdate >= \'2017-02-15\''
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
      })
  ])
}
