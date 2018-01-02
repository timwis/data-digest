exports.seed = async function (knex) {
  await knex('services').del()
  await knex('services').insert({
    id: 1,
    name: 'Crime incidents',
    slug: 'crime-incidents',
    endpoint: 'https:\\/\\/phl.carto.com\\/api\\/v2\\/sql\\?q=.+',
    subject_template: '{{response.rows.length}} crimes',
    body_template: `
      <h1>Crime incidents</h1>
      <ul>
      {{#each response.rows}}
        <li>{{location_block}}</li>
      {{/each}}
      </ul>
    `
  })

  await knex('queries').del()
  await knex('queries').insert([
    {
      id: 1,
      service_id: 1,
      url: 'https://phl.carto.com/api/v2/sql?q=SELECT * FROM incidents_part1_part2 WHERE dc_dist = 1 AND dispatch_date_time >= \'2017-12-31\''
    },
    {
      id: 2,
      service_id: 1,
      url: 'https://phl.carto.com/api/v2/sql?q=SELECT * FROM incidents_part1_part2 WHERE dc_dist = 2 AND dispatch_date_time >= \'2017-12-31\''
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
