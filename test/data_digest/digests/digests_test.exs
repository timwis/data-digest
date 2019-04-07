defmodule DataDigest.DigestsTest do
  use DataDigest.DataCase

  alias DataDigest.Digests

  describe "digests" do
    alias DataDigest.Digests.Digest

    @valid_attrs %{body_template: "some body_template", endpoint_template: "some endpoint_template", name: "some name", params_schema: %{}, slug: "some slug", subject_template: "some subject_template"}
    @update_attrs %{body_template: "some updated body_template", endpoint_template: "some updated endpoint_template", name: "some updated name", params_schema: %{}, slug: "some updated slug", subject_template: "some updated subject_template"}
    @invalid_attrs %{body_template: nil, endpoint_template: nil, name: nil, params_schema: nil, slug: nil, subject_template: nil}

    def digest_fixture(attrs \\ %{}) do
      {:ok, digest} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Digests.create_digest()

      digest
    end

    test "list_digests/0 returns all digests" do
      digest = digest_fixture()
      assert Digests.list_digests() == [digest]
    end

    test "get_digest!/1 returns the digest with given id" do
      digest = digest_fixture()
      assert Digests.get_digest!(digest.id) == digest
    end

    test "create_digest/1 with valid data creates a digest" do
      assert {:ok, %Digest{} = digest} = Digests.create_digest(@valid_attrs)
      assert digest.body_template == "some body_template"
      assert digest.endpoint_template == "some endpoint_template"
      assert digest.name == "some name"
      assert digest.params_schema == %{}
      assert digest.slug == "some slug"
      assert digest.subject_template == "some subject_template"
    end

    test "create_digest/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Digests.create_digest(@invalid_attrs)
    end

    test "update_digest/2 with valid data updates the digest" do
      digest = digest_fixture()
      assert {:ok, %Digest{} = digest} = Digests.update_digest(digest, @update_attrs)
      assert digest.body_template == "some updated body_template"
      assert digest.endpoint_template == "some updated endpoint_template"
      assert digest.name == "some updated name"
      assert digest.params_schema == %{}
      assert digest.slug == "some updated slug"
      assert digest.subject_template == "some updated subject_template"
    end

    test "update_digest/2 with invalid data returns error changeset" do
      digest = digest_fixture()
      assert {:error, %Ecto.Changeset{}} = Digests.update_digest(digest, @invalid_attrs)
      assert digest == Digests.get_digest!(digest.id)
    end

    test "delete_digest/1 deletes the digest" do
      digest = digest_fixture()
      assert {:ok, %Digest{}} = Digests.delete_digest(digest)
      assert_raise Ecto.NoResultsError, fn -> Digests.get_digest!(digest.id) end
    end

    test "change_digest/1 returns a digest changeset" do
      digest = digest_fixture()
      assert %Ecto.Changeset{} = Digests.change_digest(digest)
    end
  end

  describe "subscribers" do
    alias DataDigest.Digests.Subscriber

    @valid_attrs %{email: "some email", params: %{"foo" => "bar"}}
    @update_attrs %{email: "some updated email", params: %{"baz" => "quz"}}
    @invalid_attrs %{email: nil}

    def subscriber_fixture(attrs \\ %{}) do
      {:ok, subscriber} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Digests.create_subscriber()

      subscriber
    end

    test "list_subscribers/0 returns all subscribers" do
      digest = digest_fixture()
      digest_id = Map.get(digest, :id)
      subscriber = subscriber_fixture(digest_id: digest_id)
      assert Digests.list_subscribers() == [subscriber]
    end

    test "get_subscriber!/1 returns the subscriber with given id" do
      digest = digest_fixture()
      digest_id = Map.get(digest, :id)
      subscriber = subscriber_fixture(digest_id: digest_id)
      assert Digests.get_subscriber!(subscriber.id) == subscriber
    end

    test "create_subscriber/1 with valid data creates a subscriber" do
      digest = digest_fixture()
      digest_id = Map.get(digest, :id)
      attrs = Map.put(@valid_attrs, :digest_id, digest_id)
      assert {:ok, %Subscriber{} = subscriber} = Digests.create_subscriber(attrs)
      assert subscriber.email == "some email"
    end

    test "create_subscriber/1 with invalid data returns error changeset" do
      digest = digest_fixture()
      digest_id = Map.get(digest, :id)
      attrs = Map.put(@invalid_attrs, :digest_id, digest_id)
      assert {:error, %Ecto.Changeset{}} = Digests.create_subscriber(attrs)
    end

    test "update_subscriber/2 with valid data updates the subscriber" do
      digest = digest_fixture()
      digest_id = Map.get(digest, :id)
      subscriber = subscriber_fixture(digest_id: digest_id)
      assert {:ok, %Subscriber{} = subscriber} = Digests.update_subscriber(subscriber, @update_attrs)
      assert subscriber.email == "some updated email"
    end

    test "update_subscriber/2 with invalid data returns error changeset" do
      digest = digest_fixture()
      digest_id = Map.get(digest, :id)
      subscriber = subscriber_fixture(digest_id: digest_id)
      assert {:error, %Ecto.Changeset{}} = Digests.update_subscriber(subscriber, @invalid_attrs)
      assert subscriber == Digests.get_subscriber!(subscriber.id)
    end

    test "delete_subscriber/1 deletes the subscriber" do
      digest = digest_fixture()
      digest_id = Map.get(digest, :id)
      subscriber = subscriber_fixture(digest_id: digest_id)
      assert {:ok, %Subscriber{}} = Digests.delete_subscriber(subscriber)
      assert_raise Ecto.NoResultsError, fn -> Digests.get_subscriber!(subscriber.id) end
    end

    test "change_subscriber/1 returns a subscriber changeset" do
      digest = digest_fixture()
      digest_id = Map.get(digest, :id)
      subscriber = subscriber_fixture(digest_id: digest_id)
      assert %Ecto.Changeset{} = Digests.change_subscriber(subscriber)
    end
  end

  describe "subscriptions" do
    test "list_unique_subscriptions/0 returns unique subscriptions with aggregated emails" do
      digest1 = digest_fixture(slug: "one")
      digest2 = digest_fixture(slug: "two")
      subscriber_fixture(digest_id: digest1.id, email: "a@a.a")
      subscriber_fixture(digest_id: digest1.id, email: "b@b.b")
      subscriber_fixture(digest_id: digest2.id, email: "c@c.c")

      subscriptions = Digests.list_unique_subscriptions()
      assert is_list(subscriptions)
      [ first | [ second | _ ] ] = subscriptions
      assert ["a@a.a", "b@b.b"] == first["emails"]
      assert ["c@c.c"] = second["emails"]
    end
  end
end
