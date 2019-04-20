defmodule DataDigestWeb.DigestControllerTest do
  use DataDigestWeb.ConnCase

  alias DataDigest.Accounts.User

  @create_attrs %{
    body_template: "some body_template",
    endpoint_template: "some endpoint_template",
    name: "some name",
    params_schema: %{},
    slug: "some slug",
    subject_template: "some subject_template"
  }
  @update_attrs %{
    body_template: "some updated body_template",
    endpoint_template: "some updated endpoint_template",
    name: "some updated name",
    params_schema: %{},
    slug: "some updated slug",
    subject_template: "some updated subject_template"
  }
  @invalid_attrs %{body_template: nil, endpoint_template: nil, name: nil, params_schema: nil, slug: nil, subject_template: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  setup context do
    case context[:authenticated] do
      true ->
        conn = context[:conn]
        user = user_fixture()
        conn = assign(conn, :current_user, user)
        {:ok, conn: conn, user: user}
      _ ->
        :ok
    end
  end

  describe "unauthenticated" do
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

  describe "index" do
    @describetag :authenticated
    test "lists all digests", %{conn: conn} do
      conn = get(conn, Routes.digest_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create digest" do
    @describetag :authenticated
    test "renders digest when data is valid", %{conn: conn} do
      create_conn = post(conn, Routes.digest_path(conn, :create), digest: @create_attrs)
      assert %{"id" => id} = json_response(create_conn, 201)["data"]

      get_conn = get(conn, Routes.digest_path(conn, :show, id))

      assert %{
               "id" => id,
               "body_template" => "some body_template",
               "endpoint_template" => "some endpoint_template",
               "name" => "some name",
               "params_schema" => %{},
               "slug" => "some slug",
               "subject_template" => "some subject_template"
             } = json_response(get_conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.digest_path(conn, :create), digest: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update digest" do
    @describetag :authenticated

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
               "slug" => "some updated slug",
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
    @describetag :authenticated

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
