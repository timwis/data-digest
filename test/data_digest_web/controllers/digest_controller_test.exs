defmodule DataDigestWeb.DigestControllerTest do
  use DataDigestWeb.ConnCase

  alias DataDigest.Digests

  @create_attrs %{body_template: "some body_template", endpoint_template: "some endpoint_template", name: "some name", params_schema: nil, slug: "some slug", subject_template: "some subject_template"}
  @update_attrs %{body_template: "some updated body_template", endpoint_template: "some updated endpoint_template", name: "some updated name", params_schema: nil, slug: "some updated slug", subject_template: "some updated subject_template"}
  @invalid_attrs %{body_template: nil, endpoint_template: nil, name: nil, params_schema: nil, slug: nil, subject_template: nil}

  def fixture(:digest) do
    {:ok, digest} = Digests.create_digest(@create_attrs)
    digest
  end

  describe "index" do
    test "lists all digests", %{conn: conn} do
      conn = get(conn, Routes.digest_path(conn, :index))
      assert html_response(conn, 200) =~ "Listing Digests"
    end
  end

  describe "new digest" do
    test "renders form", %{conn: conn} do
      conn = get(conn, Routes.digest_path(conn, :new))
      assert html_response(conn, 200) =~ "New Digest"
    end
  end

  describe "create digest" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn = post(conn, Routes.digest_path(conn, :create), digest: @create_attrs)

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == Routes.digest_path(conn, :show, id)

      conn = get(conn, Routes.digest_path(conn, :show, id))
      assert html_response(conn, 200) =~ "Show Digest"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.digest_path(conn, :create), digest: @invalid_attrs)
      assert html_response(conn, 200) =~ "New Digest"
    end
  end

  describe "edit digest" do
    setup [:create_digest]

    test "renders form for editing chosen digest", %{conn: conn, digest: digest} do
      conn = get(conn, Routes.digest_path(conn, :edit, digest))
      assert html_response(conn, 200) =~ "Edit Digest"
    end
  end

  describe "update digest" do
    setup [:create_digest]

    test "redirects when data is valid", %{conn: conn, digest: digest} do
      conn = put(conn, Routes.digest_path(conn, :update, digest), digest: @update_attrs)
      assert redirected_to(conn) == Routes.digest_path(conn, :show, digest)

      conn = get(conn, Routes.digest_path(conn, :show, digest))
      assert html_response(conn, 200) =~ "some updated body_template"
    end

    test "renders errors when data is invalid", %{conn: conn, digest: digest} do
      conn = put(conn, Routes.digest_path(conn, :update, digest), digest: @invalid_attrs)
      assert html_response(conn, 200) =~ "Edit Digest"
    end
  end

  describe "delete digest" do
    setup [:create_digest]

    test "deletes chosen digest", %{conn: conn, digest: digest} do
      conn = delete(conn, Routes.digest_path(conn, :delete, digest))
      assert redirected_to(conn) == Routes.digest_path(conn, :index)
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
