# Data Digest [![stability - experimental][experimental-img]][stability-url]
Monitors an API for new data and sends digest emails to subscribers.

Data Digest is meant to be a service for developers who want to let their users
subscribe to updates from their application, but aren't thrilled about having to
write code for confirmation emails, unsubscribe functionality, scheduling the
emails, and worrying about how it will scale. Using Data Digest, developers can
simply specify the data source's API, configure an email template, and add a
"subscribe" button to their application.

## How it works
Data Digest's database has a `services` table. A service is a data source being
subscribed to. The developer will configure their service, specifying the valid
URL pattern via regex (ie. `https:\/\/data.com\/datasets\/[A-Za-z0-9]\.json`)
and an email digest template (using [handlebars](http://handlebarsjs.com/) to
inject the data).

The developer can then add a 'subscribe' form to their application for users to
fill in their email address. On submission, the form should send a `POST`
request to their Data Digest service containing the email address and the url
being subscribed to (ie. `https://data.com/datasets/crimes.json?date={{ formatDate 'today' 'YYYY-MM-DD' }}`)

Every day, Data Digest will execute the query, render the result into the
template, and send an email to all the subscribers of that query.

Currently, Data Digest assumes that the query will only return "new" records.
Since many APIs don't let you filter by date, though, the goal is for
Data Digest to determine whether each record has been sent out before and only
send new ones (similar to how RSS readers work).

## Schema

services          | queries       | subscribers
------------------|---------------|------------
id                | id            | id
name              | service_id    | query_id
slug              | url           | email
url_regex         |               | status
subject_template  |               | unsubscribe_token
body_template     |               |

## Development
Start database and queue
> `docker-compose up db queue`

Run migrations and load seed data
> `docker-compose run --rm node npm run db:migrate`
> `docker-compose run --rm node npm run db:seed seeds/test_data.yml services queries subscribers`

Start consumer
> `docker-compose run --rm consumer`

Run scheduler
> `docker-compose run --rm scheduler`

## Deployment
Deploy application to heroku
> [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

In the heroku dashboard of the deployed application, click the **MailGun** logo.

Alternatively, use the [heroku cli](https://devcenter.heroku.com/articles/heroku-cli) to get to your MailGun dashboard.
> `heroku addons:open mailgun`

Add and verify a domain to send email from, or add and verify individual authorized recipients
> there isn't really a command to show for this step...

If you added your own domain to mailgun, change the `MAILGUN_DOMAIN` environment variable in your heroku app.
> `heroku config:set MAILGUN_DOMAIN=yourdomain.com`

Load seed data into your database
> `heroku run seed seeds/production_data.yml services`

Run the scheduler (or set it up using the scheduler add-on)
> `heroku run scheduler`

[experimental-img]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[stability-url]: https://nodejs.org/api/documentation.html#documentation_stability_index
