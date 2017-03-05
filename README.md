# subscribeme
Monitors an API for new data and sends digest emails to subscribers.

## Installation
1. Clone this repository
2. Install [Knex.js](http://knexjs.org/) via `npm install --global knex`
3. For development, install the [sqlite3](https://www.npmjs.com/package/sqlite3)
node module via `npm install --global sqlite3`
4. Run migrations via `knex migrate:latest`
5. Load sample data via `knex seed:run`

## Schema
### services
| service_id | name | slug | endpoint | template |

### queries
| query_id | service_id | query |

### subscribers
| subscriber_id | query_id | email | confirmed |
