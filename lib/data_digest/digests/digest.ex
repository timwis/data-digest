defmodule DataDigest.Digests.Digest do
  use Ecto.Schema
  import Ecto.Changeset

  schema "digests" do
    field :body_template, :string
    field :endpoint_template, :string
    field :name, :string
    field :params_schema, :map
    field :slug, :string
    field :subject_template, :string
    belongs_to :user, DataDigest.Accounts.User

    timestamps()
  end

  @doc false
  def changeset(digest, attrs) do
    digest
    |> cast(attrs, [:name, :endpoint_template, :subject_template, :body_template, :params_schema])
    |> validate_required([:name, :endpoint_template, :subject_template, :body_template])
    # |> unique_constraint(:slug)
  end
end
