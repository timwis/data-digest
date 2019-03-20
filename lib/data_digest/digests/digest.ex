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
    field :user_id, :id

    timestamps()
  end

  @doc false
  def changeset(digest, attrs) do
    digest
    |> cast(attrs, [:slug, :name, :endpoint_template, :subject_template, :body_template, :params_schema])
    |> validate_required([:slug, :name, :endpoint_template, :subject_template, :body_template])
    |> unique_constraint(:slug)
  end
end
