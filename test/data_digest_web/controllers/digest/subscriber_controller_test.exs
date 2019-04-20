defmodule DataDigestWeb.Digest.SubscriberControllerTest do
  use DataDigestWeb.ConnCase

  alias DataDigest.Digests.Digest
  alias DataDigest.Digests.Subscriber
  alias DataDigest.Accounts.User

  @create_attrs %{
    email: "some email",
    params: %{}
  }
  @update_attrs %{
    email: "some updated email",
    params: %{}
  }
  @invalid_attrs %{email: nil, params: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    setup [:create_user, :create_digest]

    test "lists all subscribers", %{conn: conn, digest: digest} do
      conn = get(conn, Routes.digest_subscriber_path(conn, :index, digest.id))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create subscriber" do
    setup [:create_user, :create_digest]

    test "renders subscriber when data is valid", %{conn: conn, digest: digest} do
      conn = post(conn, Routes.digest_subscriber_path(conn, :create, digest.id), subscriber: @create_attrs)
      assert %{"id" => subscriber_id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.digest_subscriber_path(conn, :show, digest.id, subscriber_id))

      assert %{
               "id" => subscriber_id,
               "email" => "some email",
               "params" => %{}
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, digest: digest} do
      conn = post(conn, Routes.digest_subscriber_path(conn, :create, digest.id), subscriber: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update subscriber" do
    setup [:create_user, :create_digest, :create_subscriber]

    test "renders subscriber when data is valid", %{conn: conn, subscriber: %Subscriber{id: subscriber_id} = subscriber} do
      conn = put(conn, Routes.digest_subscriber_path(conn, :update, subscriber.digest_id, subscriber), subscriber: @update_attrs)
      assert %{"id" => ^subscriber_id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.digest_subscriber_path(conn, :show, subscriber.digest_id, subscriber_id))

      assert %{
               "id" => subscriber_id,
               "email" => "some updated email",
               "params" => %{}
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, subscriber: subscriber} do
      conn = put(conn, Routes.digest_subscriber_path(conn, :update, subscriber.digest_id, subscriber), subscriber: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete subscriber" do
    setup [:create_user, :create_digest, :create_subscriber]

    test "deletes chosen subscriber", %{conn: conn, subscriber: subscriber} do
      conn = delete(conn, Routes.digest_subscriber_path(conn, :delete, subscriber.digest_id, subscriber))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.digest_subscriber_path(conn, :show, subscriber.digest_id, subscriber))
      end
    end
  end

  defp create_user(_) do
    user = user_fixture()
    {:ok, user: user}
  end

  defp create_digest(%{user: %User{} = user}) do
    digest = digest_fixture(user)
    {:ok, digest: digest}
  end

  defp create_subscriber(%{digest: %Digest{} = digest}) do
    subscriber = subscriber_fixture(digest)
    {:ok, subscriber: subscriber}
  end
end
