defmodule DataDigest.DigestsTest do
  use DataDigest.DataCase

  alias DataDigest.Digests

  describe "digests" do
    alias DataDigest.Digests.Digest

    @valid_attrs %{body_template: "some body_template", endpoint_template: "some endpoint_template", name: "some name", params_schema: %{}, slug: "some slug", subject_template: "some subject_template"}
    @update_attrs %{body_template: "some updated body_template", endpoint_template: "some updated endpoint_template", name: "some updated name", params_schema: %{}, slug: "some updated slug", subject_template: "some updated subject_template"}
    @invalid_attrs %{body_template: nil, endpoint_template: nil, name: nil, params_schema: nil, slug: nil, subject_template: nil}

    test "list_digests/0 returns all digests" do
      user = user_fixture()
      digest = digest_fixture(user)
      assert Digests.list_digests() == [digest]
    end

    test "get_digest!/1 returns the digest with given id" do
      user = user_fixture()
      digest = digest_fixture(user)
      assert Digests.get_digest!(digest.id) == digest
    end

    test "create_digest/1 with valid data creates a digest" do
      user = user_fixture()
      assert {:ok, %Digest{} = digest} = Digests.create_digest(user, @valid_attrs)
      assert digest.body_template == "some body_template"
      assert digest.endpoint_template == "some endpoint_template"
      assert digest.name == "some name"
      assert digest.params_schema == %{}
      assert digest.slug == "some slug"
      assert digest.subject_template == "some subject_template"
    end

    test "create_digest/1 with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Digests.create_digest(user, @invalid_attrs)
    end

    test "update_digest/2 with valid data updates the digest" do
      user = user_fixture()
      digest = digest_fixture(user)
      assert {:ok, %Digest{} = digest} = Digests.update_digest(digest, @update_attrs)
      assert digest.body_template == "some updated body_template"
      assert digest.endpoint_template == "some updated endpoint_template"
      assert digest.name == "some updated name"
      assert digest.params_schema == %{}
      assert digest.slug == "some updated slug"
      assert digest.subject_template == "some updated subject_template"
    end

    test "update_digest/2 with invalid data returns error changeset" do
      user = user_fixture()
      digest = digest_fixture(user)
      assert {:error, %Ecto.Changeset{}} = Digests.update_digest(digest, @invalid_attrs)
      assert digest == Digests.get_digest!(digest.id)
    end

    test "delete_digest/1 deletes the digest" do
      user = user_fixture()
      digest = digest_fixture(user)
      assert {:ok, %Digest{}} = Digests.delete_digest(digest)
      assert_raise Ecto.NoResultsError, fn -> Digests.get_digest!(digest.id) end
    end

    test "change_digest/1 returns a digest changeset" do
      user = user_fixture()
      digest = digest_fixture(user)
      assert %Ecto.Changeset{} = Digests.change_digest(user, digest)
    end
  end

  describe "subscribers" do
    alias DataDigest.Digests.Subscriber

    @valid_attrs %{email: "some email", params: %{"foo" => "bar"}}
    @update_attrs %{email: "some updated email", params: %{"baz" => "quz"}}
    @invalid_attrs %{email: nil}

    test "list_subscribers/0 returns all subscribers" do
      user = user_fixture()
      digest = digest_fixture(user)
      subscriber = subscriber_fixture(digest)
      assert Digests.list_subscribers() == [subscriber]
    end

    test "get_subscriber!/1 returns the subscriber with given id" do
      user = user_fixture()
      digest = digest_fixture(user)
      subscriber = subscriber_fixture(digest)
      assert Digests.get_subscriber!(subscriber.id) == subscriber
    end

    test "create_subscriber/1 with valid data creates a subscriber" do
      user = user_fixture()
      digest = digest_fixture(user)
      assert {:ok, %Subscriber{} = subscriber} = Digests.create_subscriber(digest, @valid_attrs)
      assert subscriber.email == "some email"
    end

    test "create_subscriber/1 with invalid data returns error changeset" do
      user = user_fixture()
      digest = digest_fixture(user)
      assert {:error, %Ecto.Changeset{}} = Digests.create_subscriber(digest, @invalid_attrs)
    end

    test "update_subscriber/2 with valid data updates the subscriber" do
      user = user_fixture()
      digest = digest_fixture(user)
      subscriber = subscriber_fixture(digest)
      assert {:ok, %Subscriber{} = subscriber} = Digests.update_subscriber(subscriber, @update_attrs)
      assert subscriber.email == "some updated email"
    end

    test "update_subscriber/2 with invalid data returns error changeset" do
      user = user_fixture()
      digest = digest_fixture(user)
      subscriber = subscriber_fixture(digest)
      assert {:error, %Ecto.Changeset{}} = Digests.update_subscriber(subscriber, @invalid_attrs)
      assert subscriber == Digests.get_subscriber!(subscriber.id)
    end

    test "delete_subscriber/1 deletes the subscriber" do
      user = user_fixture()
      digest = digest_fixture(user)
      subscriber = subscriber_fixture(digest)
      assert {:ok, %Subscriber{}} = Digests.delete_subscriber(subscriber)
      assert_raise Ecto.NoResultsError, fn -> Digests.get_subscriber!(subscriber.id) end
    end

    test "change_subscriber/1 returns a subscriber changeset" do
      user = user_fixture()
      digest = digest_fixture(user)
      subscriber = subscriber_fixture(digest)
      assert %Ecto.Changeset{} = Digests.change_subscriber(digest, subscriber)
    end
  end
end
