defmodule DataDigestWeb.AuthPlugsTest do
  use DataDigestWeb.ConnCase
  alias DataDigestWeb.AuthPlugs
  alias DataDigest.Accounts.User

  setup %{conn: conn} do
    conn =
      conn
      |> bypass_through(DataDigestWeb.Router, :api)
      |> get("/")

    {:ok, conn: conn}
  end

  test "require_auth! halts when current_user isn't set", %{conn: conn} do
    conn = AuthPlugs.require_auth!(conn, [])
    assert conn.halted
  end

  test "require_auth! continues when current_user is set", %{conn: conn} do
    conn =
      conn
      |> assign(:current_user, %User{})
      |> AuthPlugs.require_auth!([])
    refute conn.halted
  end

  test "load_auth loads user from session into assigns", %{conn: conn} do
    user = user_fixture()
    conn =
      conn
      |> put_session(:user_id, user.id)
      |> AuthPlugs.load_auth([])

    assert conn.assigns.current_user.id == user.id
  end

  test "load_auth with no session sets current_user to nil", %{conn: conn} do
    conn = AuthPlugs.load_auth(conn, [])
    assert conn.assigns.current_user == nil
  end
end
