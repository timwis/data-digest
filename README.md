# DataDigest
Monitors an API for new data and sends digest emails to subscribers.

Data Digest is meant to be a service for developers who want to let their users subscribe to updates from their application, but aren't thrilled about having to write code for confirmation emails, unsubscribe functionality, scheduling the emails, and worrying about how it will scale. Using Data Digest, developers can simply specify the data source's API, configure an email template, and add a "subscribe" button to their application.

# Local development

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`
  * In another terminal, start the frontend server with `cd assets && npm run serve`

Now you can visit [`localhost:8080`](http://localhost:8080) from your browser.
