use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :data_digest, DataDigestWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :data_digest, DataDigest.Repo,
  url: System.get_env("TEST_DATABASE_URL") || "postgres://postgres:postgres@localhost:5432/data_digest_test",
  pool: Ecto.Adapters.SQL.Sandbox

# Configure amqp
config :data_digest, DataDigestQueue.Broker,
  adapter: ConduitAMQP,
  url: System.get_env("RABBITMQ_URL") || "amqp://guest:guest@localhost:5672"
