defmodule DataDigest.TestHelpers do
  alias DataDigest.Digests
  alias DataDigest.Accounts

  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        email: "some email",
        oauth_id: "some oauth id"
      })
      |> Accounts.create_user()

    user
  end

  def digest_fixture(%Accounts.User{} = user, attrs \\ %{}) do
      attrs = Enum.into(attrs, %{
        slug: "some slug",
        name: "some name",
        endpoint_template: "some endpoint template",
        subject_template: "some subject template",
        body_template: "some body template",
        params_schema: %{}
      })
      {:ok, digest} = Digests.create_digest(user, attrs)
      digest
  end

  def subscriber_fixture(%Digests.Digest{} = digest, attrs \\ %{}) do
      attrs = Enum.into(attrs, %{
        email: "some email",
        params: %{"foo" => "bar"}
      })
      {:ok, subscriber} = Digests.create_subscriber(digest, attrs)
      subscriber
  end
end
