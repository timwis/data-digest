defmodule DataDigest.AccountsTest do
  use DataDigest.DataCase

  alias DataDigest.Accounts
  alias Ueberauth.Auth

  describe "users" do
    alias DataDigest.Accounts.User

    @valid_attrs %{email: "some email", oauth_id: "some oauth id"}
    @update_attrs %{email: "another email", oauth_id: "another oauth id"}
    @invalid_attrs %{email: nil, oauth_id: nil}

    @valid_auth_attrs %Auth{uid: "foo", info: %{email: "b@b.b", image: "xyz"}}
    @invalid_auth_attrs %Auth{uid: "foo", info: %{email: nil, image: nil}}

    def user_fixture(attrs \\ %{}) do
      {:ok, user} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Accounts.create_user()

      user
    end

    test "list_users/0 returns all users" do
      user = user_fixture()
      assert Accounts.list_users() == [user]
    end

    test "get_user!/1 returns the user with given id" do
      user = user_fixture()
      assert Accounts.get_user!(user.id) == user
    end

    test "create_user/1 with valid data creates a user" do
      assert {:ok, %User{} = user} = Accounts.create_user(@valid_attrs)
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Accounts.create_user(@invalid_attrs)
    end

    test "update_user/2 with valid data updates the user" do
      user = user_fixture()
      assert {:ok, %User{} = user} = Accounts.update_user(user, @update_attrs)
    end

    test "update_user/2 with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Accounts.update_user(user, @invalid_attrs)
      assert user == Accounts.get_user!(user.id)
    end

    test "delete_user/1 deletes the user" do
      user = user_fixture()
      assert {:ok, %User{}} = Accounts.delete_user(user)
      assert_raise Ecto.NoResultsError, fn -> Accounts.get_user!(user.id) end
    end

    test "change_user/1 returns a user changeset" do
      user = user_fixture()
      assert %Ecto.Changeset{} = Accounts.change_user(user)
    end

    test "get_or_create_user/1 returns existing user" do
      user = user_fixture()
      auth = %Auth{uid: user.oauth_id}
      assert {:ok, %User{} = user} == Accounts.get_or_create_user(auth)
    end

    test "get_or_create_user/1 creates user if not existing" do
      {:ok, %User{} = user} = Accounts.get_or_create_user(@valid_auth_attrs)
      assert user.oauth_id == "foo"
      assert user.email == "b@b.b"
      assert user.avatar_url == "xyz"
    end

    test "get_or_create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Accounts.get_or_create_user(@invalid_auth_attrs)
    end

    test "get_or_create_user/1 with nil oauth_id returns error changeset" do
      attrs = %Auth{uid: nil}
      assert {:error, %Ecto.Changeset{}} = Accounts.get_or_create_user(attrs)
    end
  end
end
