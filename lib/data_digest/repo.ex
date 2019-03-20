defmodule DataDigest.Repo do
  use Ecto.Repo,
    otp_app: :data_digest,
    adapter: Ecto.Adapters.Postgres
end
