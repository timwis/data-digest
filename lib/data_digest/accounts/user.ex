defmodule DataDigest.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  @derive {Jason.Encoder, only: [:id, :email, :avatar_url]}

  schema "users" do
    field :email, :string
    field :oauth_id, :string
    field :avatar_url, :string

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :oauth_id, :avatar_url])
    |> validate_required([:email, :oauth_id])
    |> unique_constraint(:email)
  end
end
