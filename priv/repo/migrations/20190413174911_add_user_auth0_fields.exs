defmodule DataDigest.Repo.Migrations.AddUserAuth0Fields do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :email, :string, null: false
      add :oauth_id, :string, null: false
      add :avatar_url, :string
    end

    create unique_index(:users, [:email])
  end
end
