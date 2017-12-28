exports.seed = async function (knex) {
  await knex('services').del()
  await knex('services').insert({
    id: 1,
    name: 'Crime incidents',
    slug: 'crime-incidents',
    endpoint: 'https:\\/\\/phl.carto.com\\/api\\/v2\\/sql\\?q=.+',
    template: '<h1>Crime incidents</h1>{{#each response.rows}}<li>{{location_block}}</li>{{/each}}'
  })

  await knex('queries').del()
  await knex('queries').insert([
    {
      id: 1,
      service_id: 1,
      url: 'https://phl.carto.com/api/v2/sql?q=SELECT * FROM pol_incidents_part1_part2 WHERE dispatch_date_time >= \'2017-02-15\''
    },
    {
      id: 2,
      service_id: 1,
      url: 'https://phl.carto.com/api/v2/sql?q=SELECT * FROM li_clean_seal WHERE actdate >= \'2017-02-15\''
    }
  ])

  await knex('subscribers').del()
  await knex('subscribers').insert([
    {
      id: 1,
      query_id: 1,
      email: 'a@a.com'
    },
    {
      id: 2,
      query_id: 1,
      email: 'b@b.com'
    },
    {
      id: 3,
      query_id: 2,
      email: 'c@c.com'
    }
  ])
}
