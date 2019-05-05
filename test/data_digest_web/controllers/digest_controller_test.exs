defmodule DataDigestWeb.DigestControllerTest do
  use DataDigestWeb.ConnCase

  alias DataDigest.Digests
  alias DataDigest.Accounts.User

  @create_attrs %{
    body_template: "some body_template",
    endpoint_template: "some endpoint_template",
    name: "some name",
    params_schema: %{},
    subject_template: "some subject_template"
  }
  @update_attrs %{
    body_template: "some updated body_template",
    endpoint_template: "some updated endpoint_template",
    name: "some updated name",
    params_schema: %{},
    subject_template: "some updated subject_template"
  }
  @invalid_attrs %{body_template: nil, endpoint_template: nil, name: nil, params_schema: nil, subject_template: nil}

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

  defp count_digests() do
    Enum.count(Digests.list_digests())
  end

  describe "unauthenticated digests" do
    test "requires user authentication on protected resources", %{conn: conn} do
      Enum.each([
        get(conn, Routes.digest_path(conn, :index)),
        get(conn, Routes.digest_path(conn, :show, "123")),
        post(conn, Routes.digest_path(conn, :create, %{})),
        put(conn, Routes.digest_path(conn, :update, "123", %{})),
        delete(conn, Routes.digest_path(conn, :delete, "123"))
      ], fn conn ->
        assert json_response(conn, 401)
        assert conn.halted
      end)
    end
  end

  describe "unauthorised digests" do
    test "prevents actions on another user's digest", %{conn: conn} do
      owner = user_fixture(email: "owner@owner.com")
      digest = digest_fixture(owner)
      non_owner = user_fixture(email: "non@owner.com")
      conn = assign(conn, :current_user, non_owner)

      assert_error_sent :not_found, fn ->
        get(conn, Routes.digest_path(conn, :show, digest))
      end
      assert_error_sent :not_found, fn ->
        put(conn, Routes.digest_path(conn, :update, digest, digest: @update_attrs))
      end
      assert_error_sent :not_found, fn ->
        delete(conn, Routes.digest_path(conn, :delete, digest))
      end
    end
  end

  describe "list digests" do
    setup [:create_user, :authenticate]

    test "lists all user's digests", %{conn: conn, user: user} do
      user_digest = digest_fixture(user, name: "my digest")
      _other_user_digest = digest_fixture(user_fixture(email: "b@b.b"), name: "anothers digest")
      conn = get(conn, Routes.digest_path(conn, :index))
      data = json_response(conn, 200)["data"]
      assert length(data) == 1
      assert hd(data)["name"] == user_digest.name
    end
  end

  describe "show digest" do
    setup [:create_user, :authenticate]

    test "shows a user's digest", %{conn: conn, user: user} do
      digest = digest_fixture(user, name: "my digest")
      conn = get(conn, Routes.digest_path(conn, :show, digest.id))
      assert json_response(conn, 200)["data"]["name"] == digest.name
    end
  end

  describe "create digest" do
    setup [:create_user, :authenticate]

    test "returns digest when data is valid", %{conn: conn} do
      create_conn = post(conn, Routes.digest_path(conn, :create), digest: @create_attrs)
      assert %{"id" => id} = json_response(create_conn, 201)["data"]

      get_conn = get(conn, Routes.digest_path(conn, :show, id))

      assert %{
               "id" => id,
               "body_template" => "some body_template",
               "endpoint_template" => "some endpoint_template",
               "name" => "some name",
               "params_schema" => %{},
               "subject_template" => "some subject_template"
             } = json_response(get_conn, 200)["data"]
    end

    test "returns errors when data is invalid", %{conn: conn} do
      count_before = count_digests()
      conn = post(conn, Routes.digest_path(conn, :create), digest: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
      assert count_before == count_digests()
    end
  end

  describe "update digest" do
    setup [:create_user, :authenticate]

    test "renders digest when data is valid", %{conn: conn, user: %User{} = user} do
      digest = digest_fixture(user)
      id = digest.id
      update_conn = put(conn, Routes.digest_path(conn, :update, digest), digest: @update_attrs)
      assert %{"id" => ^id} = json_response(update_conn, 200)["data"]

      get_conn = get(conn, Routes.digest_path(conn, :show, id))

      assert %{
               "id" => id,
               "body_template" => "some updated body_template",
               "endpoint_template" => "some updated endpoint_template",
               "name" => "some updated name",
               "params_schema" => %{},
               "subject_template" => "some updated subject_template"
             } = json_response(get_conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, user: %User{} = user} do
      digest = digest_fixture(user)
      conn = put(conn, Routes.digest_path(conn, :update, digest), digest: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete digest" do
    setup [:create_user, :authenticate]

    test "deletes chosen digest", %{conn: conn, user: %User{} = user} do
      digest = digest_fixture(user)
      delete_conn = delete(conn, Routes.digest_path(conn, :delete, digest))
      assert response(delete_conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.digest_path(conn, :show, digest))
      end
    end
  end
end
