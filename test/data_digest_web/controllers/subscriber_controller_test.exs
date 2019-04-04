defmodule DataDigestWeb.SubscriberControllerTest do
  use DataDigestWeb.ConnCase

  alias DataDigest.Digests

  @create_digest_attrs %{body_template: "some body_template", endpoint_template: "some endpoint_template", name: "some name", params_schema: nil, slug: "some slug", subject_template: "some subject_template"}
  @create_attrs %{email: "some email"}
  @update_attrs %{email: "some updated email"}
  @invalid_attrs %{email: nil}

  describe "index" do
    setup [:create_digest]

    test "lists all subscribers", %{conn: conn, digest: digest} do
      conn = get(conn, Routes.digest_subscriber_path(conn, :index, digest.id))
      assert html_response(conn, 200) =~ "Listing Subscribers"
    end
  end

  describe "new subscriber" do
    setup [:create_digest]

    test "renders form", %{conn: conn, digest: digest} do
      conn = get(conn, Routes.digest_subscriber_path(conn, :new, digest.id))
      assert html_response(conn, 200) =~ "New Subscriber"
    end
  end

  describe "create subscriber" do
    setup [:create_digest]

    test "redirects to show when data is valid", %{conn: conn, digest: digest} do
      conn = post(conn, Routes.digest_subscriber_path(conn, :create, digest.id), subscriber: @create_attrs)

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == Routes.digest_subscriber_path(conn, :show, digest.id, id)

      conn = get(conn, Routes.digest_subscriber_path(conn, :show, digest.id, id))
      assert html_response(conn, 200) =~ "Show Subscriber"
    end

    test "renders errors when data is invalid", %{conn: conn, digest: digest} do
      conn = post(conn, Routes.digest_subscriber_path(conn, :create, digest.id), subscriber: @invalid_attrs)
      assert html_response(conn, 200) =~ "New Subscriber"
    end
  end

  describe "edit subscriber" do
    setup [:create_subscriber]

    test "renders form for editing chosen subscriber", %{conn: conn, subscriber: subscriber} do
      conn = get(conn, Routes.digest_subscriber_path(conn, :edit, subscriber.digest_id, subscriber))
      assert html_response(conn, 200) =~ "Edit Subscriber"
    end
  end

  describe "update subscriber" do
    setup [:create_subscriber]

    test "redirects when data is valid", %{conn: conn, subscriber: subscriber} do
      conn = put(conn, Routes.digest_subscriber_path(conn, :update, subscriber.digest_id, subscriber), subscriber: @update_attrs)
      assert redirected_to(conn) == Routes.digest_subscriber_path(conn, :show, subscriber.digest_id, subscriber)

      conn = get(conn, Routes.digest_subscriber_path(conn, :show, subscriber.digest_id, subscriber))
      assert html_response(conn, 200) =~ "some updated email"
    end

    test "renders errors when data is invalid", %{conn: conn, subscriber: subscriber} do
      conn = put(conn, Routes.digest_subscriber_path(conn, :update, subscriber.digest_id, subscriber), subscriber: @invalid_attrs)
      assert html_response(conn, 200) =~ "Edit Subscriber"
    end
  end

  describe "delete subscriber" do
    setup [:create_subscriber]

    test "deletes chosen subscriber", %{conn: conn, subscriber: subscriber} do
      conn = delete(conn, Routes.digest_subscriber_path(conn, :delete, subscriber.digest_id, subscriber))
      assert redirected_to(conn) == Routes.digest_subscriber_path(conn, :index, subscriber.digest_id)
      assert_error_sent 404, fn ->
        get(conn, Routes.digest_subscriber_path(conn, :show, subscriber.digest_id, subscriber))
      end
    end
  end

  defp create_subscriber(context) do
    {:ok, digest: digest} = create_digest(context)
    digest_id = Map.get(digest, :id)
    attrs = Map.put(@create_attrs, :digest_id, digest_id)

    {:ok, subscriber} = Digests.create_subscriber(attrs)
    {:ok, subscriber: subscriber}
  end

  defp create_digest(_) do
    {:ok, digest} = Digests.create_digest(@create_digest_attrs)
    {:ok, digest: digest}
  end
end
