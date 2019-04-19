defmodule DataDigest.Digests.Subscriber do
  use Ecto.Schema
  import Ecto.Changeset

  schema "subscribers" do
    field :email, :string
    field :params, :map
    belongs_to :digest, DataDigest.Digests.Digest

    timestamps()
  end

  @doc false
  def changeset(subscriber, attrs) do
    subscriber
    |> cast(attrs, [:email, :params])
    |> unique_constraint(:email, name: :subscribers_email_digest_id_params_index)
    |> validate_required([:email])
  end
end
