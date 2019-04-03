defmodule DataDigest.Digests.Subscriber do
  use Ecto.Schema
  import Ecto.Changeset

  schema "subscribers" do
    field :email, :string
    field :digest_id, :id
    field :params, :map

    timestamps()
  end

  @doc false
  def changeset(subscriber, attrs) do
    subscriber
    |> cast(attrs, [:email, :digest_id, :params])
    |> unique_constraint(:email, name: :subscribers_email_digest_id_params_index)
    |> validate_required([:email, :digest_id])
  end
end
