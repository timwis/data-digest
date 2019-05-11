# DataDigest
Monitors an API for new data and sends digest emails to subscribers.

Data Digest is meant to be a service for developers who want to let their users subscribe to updates from their application, but aren't thrilled about having to write code for confirmation emails, unsubscribe functionality, scheduling the emails, and worrying about how it will scale. Using Data Digest, developers can simply specify the data source's API, configure an email template, and add a "subscribe" button to their application.

# Local development

To start your Phoenix server:

* Setup the database with `docker-compose run --rm server mix do ecto.create, ecto.migrate`
* Bring your server up with `docker-compose up`

Now you can visit [`localhost:8080`](http://localhost:8080) from your browser.

Run tests with `docker-compose run --rm -e MIX_ENV=test server mix test`
