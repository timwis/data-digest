defmodule DataDigestWeb.SubscriberControllerTest do
  use DataDigestWeb.ConnCase

  alias DataDigest.Digests

  @create_attrs %{email: "some email"}
  @update_attrs %{email: "some updated email"}
  @invalid_attrs %{email: nil}

  def fixture(:subscriber) do
    {:ok, subscriber} = Digests.create_subscriber(@create_attrs)
    subscriber
  end

  describe "index" do
    test "lists all subscribers", %{conn: conn} do
      conn = get(conn, Routes.subscriber_path(conn, :index))
      assert html_response(conn, 200) =~ "Listing Subscribers"
    end
  end

  describe "new subscriber" do
    test "renders form", %{conn: conn} do
      conn = get(conn, Routes.subscriber_path(conn, :new))
      assert html_response(conn, 200) =~ "New Subscriber"
    end
  end

  describe "create subscriber" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn = post(conn, Routes.subscriber_path(conn, :create), subscriber: @create_attrs)

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == Routes.subscriber_path(conn, :show, id)

      conn = get(conn, Routes.subscriber_path(conn, :show, id))
      assert html_response(conn, 200) =~ "Show Subscriber"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.subscriber_path(conn, :create), subscriber: @invalid_attrs)
      assert html_response(conn, 200) =~ "New Subscriber"
    end
  end

  describe "edit subscriber" do
    setup [:create_subscriber]

    test "renders form for editing chosen subscriber", %{conn: conn, subscriber: subscriber} do
      conn = get(conn, Routes.subscriber_path(conn, :edit, subscriber))
      assert html_response(conn, 200) =~ "Edit Subscriber"
    end
  end

  describe "update subscriber" do
    setup [:create_subscriber]

    test "redirects when data is valid", %{conn: conn, subscriber: subscriber} do
      conn = put(conn, Routes.subscriber_path(conn, :update, subscriber), subscriber: @update_attrs)
      assert redirected_to(conn) == Routes.subscriber_path(conn, :show, subscriber)

      conn = get(conn, Routes.subscriber_path(conn, :show, subscriber))
      assert html_response(conn, 200) =~ "some updated email"
    end

    test "renders errors when data is invalid", %{conn: conn, subscriber: subscriber} do
      conn = put(conn, Routes.subscriber_path(conn, :update, subscriber), subscriber: @invalid_attrs)
      assert html_response(conn, 200) =~ "Edit Subscriber"
    end
  end

  describe "delete subscriber" do
    setup [:create_subscriber]

    test "deletes chosen subscriber", %{conn: conn, subscriber: subscriber} do
      conn = delete(conn, Routes.subscriber_path(conn, :delete, subscriber))
      assert redirected_to(conn) == Routes.subscriber_path(conn, :index)
      assert_error_sent 404, fn ->
        get(conn, Routes.subscriber_path(conn, :show, subscriber))
      end
    end
  end

  defp create_subscriber(_) do
    subscriber = fixture(:subscriber)
    {:ok, subscriber: subscriber}
  end
end
