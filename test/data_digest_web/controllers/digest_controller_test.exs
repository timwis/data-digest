defmodule DataDigestWeb.DigestControllerTest do
  use DataDigestWeb.ConnCase

  alias DataDigest.Digests
  alias DataDigest.Digests.Digest

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

  def fixture(:digest) do
    {:ok, digest} = Digests.create_digest(@create_attrs)
    digest
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all digests", %{conn: conn} do
      conn = get(conn, Routes.digest_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create digest" do
    test "renders digest when data is valid", %{conn: conn} do
      conn = post(conn, Routes.digest_path(conn, :create), digest: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.digest_path(conn, :show, id))

      assert %{
               "id" => id,
               "body_template" => "some body_template",
               "endpoint_template" => "some endpoint_template",
               "name" => "some name",
               "params_schema" => %{},
               "slug" => "some slug",
               "subject_template" => "some subject_template"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.digest_path(conn, :create), digest: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update digest" do
    setup [:create_digest]

    test "renders digest when data is valid", %{conn: conn, digest: %Digest{id: id} = digest} do
      conn = put(conn, Routes.digest_path(conn, :update, digest), digest: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.digest_path(conn, :show, id))

      assert %{
               "id" => id,
               "body_template" => "some updated body_template",
               "endpoint_template" => "some updated endpoint_template",
               "name" => "some updated name",
               "params_schema" => {},
               "slug" => "some updated slug",
               "subject_template" => "some updated subject_template"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, digest: digest} do
      conn = put(conn, Routes.digest_path(conn, :update, digest), digest: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete digest" do
    setup [:create_digest]

    test "deletes chosen digest", %{conn: conn, digest: digest} do
      conn = delete(conn, Routes.digest_path(conn, :delete, digest))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.digest_path(conn, :show, digest))
      end
    end
  end

  defp create_digest(_) do
    digest = fixture(:digest)
    {:ok, digest: digest}
  end
end
