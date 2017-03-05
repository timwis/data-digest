# subscribeme [![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/subscribeme/Lobby)
Monitors an API for new data and sends digest emails to subscribers.

SubscribeMe is meant to be a service for developers who want to let their users
subscribe to updates from their application, but aren't thrilled about having to
write code for confirmation emails, unsubscribe functionality, scheduling the
emails, and worrying about how it will scale. Using SubscribeMe, developers can
simply specify the data source's API, configure an email template, and add a
"subscribe" button to their application.

## How it [will] work~~s~~
SubscribeMe's database has a `services` table. A service is a data source being
subscribed to. The developer will configure their service, specifying the
base endpoint (ie. `https://phl.carto.com/api/v2/sql`) and an email digest template
(using [handlebars](http://handlebarsjs.com/) to inject the data).

The developer can then add a 'subscribe' form to their application for users to
fill in their email address. On submission, the form should send a `POST`
request to their SubscribeMe service containing the email address and the query
being subscribed to (ie. `?q=SELECT * FROM crimes WHERE district = 12 AND date =
current_date`).

Every day, SubscribeMe will execute the query, render the result into the
template, and send an email to all the subscribers of that query.

Currently, SubscribeMe assumes that the query will only return "new" records.
Since many APIs don't let you filter by date, though, the goal is for
SubscribeMe to determine whether each record has been sent out before and only
send new ones (similar to how RSS readers work).

## Installation
1. Clone this repository
2. Install [Knex.js](http://knexjs.org/) via `npm install --global knex`
3. For development, install the [sqlite3](https://www.npmjs.com/package/sqlite3)
node module via `npm install --global sqlite3`
4. Run migrations via `knex migrate:latest`
5. Load sample data via `knex seed:run`

## Schema

services    | queries       | subscribers
------------|---------------|------------
service_id  | query_id      | subscriber_id
name        | service_id    | query_id
slug        | query         | email
endpoint    |               | confirmed
template    |               |
