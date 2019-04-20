defmodule DataDigestWeb.Digest.SubscriberControllerTest do
  use DataDigestWeb.ConnCase

  alias DataDigest.Digests.Digest
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

  defp create_user(_) do
    user = user_fixture()
    {:ok, user: user}
  end

  defp authenticate(%{conn: conn, user: %User{} = user}) do
    conn = assign(conn, :current_user, user)
    {:ok, conn: conn}
  end

  defp create_digest(%{user: %User{} = user}) do
    digest = digest_fixture(user)
    {:ok, digest: digest}
  end

  defp create_subscriber(%{digest: %Digest{} = digest}) do
    subscriber = subscriber_fixture(digest)
    {:ok, subscriber: subscriber}
  end

  describe "unauthenticated subscribers" do
    test "requires user authentication on protected resources", %{conn: conn} do
      Enum.each([
        get(conn, Routes.digest_subscriber_path(conn, :index, "123")),
        get(conn, Routes.digest_subscriber_path(conn, :show, "123", "456")),
        put(conn, Routes.digest_subscriber_path(conn, :update, "123", "456", %{})),
        delete(conn, Routes.digest_subscriber_path(conn, :delete, "123", "456"))
      ], fn conn ->
        assert json_response(conn, 401)
        assert conn.halted
      end)
    end
  end

  describe "unauthorised subscribers" do
    test "prevents actions on another user's subscriber", %{conn: conn} do
      owner = user_fixture(email: "owner@owner.com")
      digest = digest_fixture(owner)
      subscriber = subscriber_fixture(digest)
      non_owner = user_fixture(email: "non@owner.com")
      conn = assign(conn, :current_user, non_owner)

      assert_error_sent :not_found, fn ->
        get(conn, Routes.digest_subscriber_path(conn, :show, digest, subscriber))
      end
      assert_error_sent :not_found, fn ->
        put(conn, Routes.digest_subscriber_path(conn, :update, digest, subscriber, subscriber: @update_attrs))
      end
      assert_error_sent :not_found, fn ->
        delete(conn, Routes.digest_subscriber_path(conn, :delete, digest, subscriber))
      end
    end
  end

  describe "index" do
    setup [:create_user, :authenticate, :create_digest]

    test "lists all digest's subscribers", %{conn: conn, digest: digest, user: user} do
      digest_subscriber = subscriber_fixture(digest, email: "me@me.com")
      _other_digest_subscriber = subscriber_fixture(digest_fixture(user, slug: "other"))
      conn = get(conn, Routes.digest_subscriber_path(conn, :index, digest.id))
      data = json_response(conn, 200)["data"]
      assert length(data) == 1
      assert hd(data)["email"] == digest_subscriber.email
    end
  end

  describe "create subscriber" do
    setup [:create_user, :create_digest]

    test "renders subscriber when data is valid", %{conn: conn, digest: digest, user: user} do
      create_conn = post(conn, Routes.digest_subscriber_path(conn, :create, digest), subscriber: @create_attrs)
      assert %{"id" => subscriber_id} = json_response(create_conn, 201)["data"]

      get_conn = assign(conn, :current_user, user)
      get_conn = get(get_conn, Routes.digest_subscriber_path(get_conn, :show, digest, subscriber_id))

      assert %{
               "id" => subscriber_id,
               "email" => "some email",
               "params" => %{}
             } = json_response(get_conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, digest: digest} do
      conn = post(conn, Routes.digest_subscriber_path(conn, :create, digest), subscriber: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update subscriber" do
    setup [:create_user, :authenticate, :create_digest, :create_subscriber]

    test "renders subscriber when data is valid", %{conn: conn, digest: digest, subscriber: subscriber} do
      subscriber_id = subscriber.id
      update_conn = put(conn, Routes.digest_subscriber_path(conn, :update, digest, subscriber), subscriber: @update_attrs)
      assert %{"id" => ^subscriber_id} = json_response(update_conn, 200)["data"]

      get_conn = get(conn, Routes.digest_subscriber_path(conn, :show, subscriber.digest_id, subscriber_id))

      assert %{
               "id" => subscriber_id,
               "email" => "some updated email",
               "params" => %{}
             } = json_response(get_conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, subscriber: subscriber} do
      conn = put(conn, Routes.digest_subscriber_path(conn, :update, subscriber.digest_id, subscriber), subscriber: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete subscriber" do
    setup [:create_user, :authenticate, :create_digest, :create_subscriber]

    test "deletes chosen subscriber", %{conn: conn, digest: digest, subscriber: subscriber} do
      delete_conn = delete(conn, Routes.digest_subscriber_path(conn, :delete, digest, subscriber))
      assert response(delete_conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.digest_subscriber_path(conn, :show, subscriber.digest_id, subscriber))
      end
    end
  end
end
