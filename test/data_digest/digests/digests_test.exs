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
end
