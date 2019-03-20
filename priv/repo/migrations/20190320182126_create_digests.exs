defmodule DataDigest.Repo.Migrations.CreateDigests do
  use Ecto.Migration

  def change do
    create table(:digests) do
      add :slug, :string
      add :name, :string
      add :endpoint_template, :string
      add :subject_template, :string
      add :body_template, :string
      add :params_schema, :map
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create unique_index(:digests, [:slug])
    create index(:digests, [:user_id])
  end
end
