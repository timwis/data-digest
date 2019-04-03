defmodule DataDigest.Repo.Migrations.CreateSubscribers do
  use Ecto.Migration

  def change do
    create table(:subscribers) do
      add :email, :string
      add :digest_id, references(:digests, on_delete: :delete_all), null: false
      add :params, :map, default: %{}, null: false

      timestamps()
    end

    create index(:subscribers, [:digest_id])
    create unique_index(:subscribers, [:email, :digest_id, :params])
  end
end
