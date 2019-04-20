defmodule DataDigestWeb.AuthPlugs do
  import Plug.Conn
  alias DataDigest.Accounts

  def load_auth(conn, _opts) do
    user_id = get_session(conn, :user_id)

    cond do
      conn.assigns[:current_user] ->
        conn
      user = user_id && Accounts.get_user(user_id) ->
        assign(conn, :current_user, user)
      true ->
        assign(conn, :current_user, nil)
    end
  end

  def require_auth!(conn, _opts) do
    if conn.assigns.current_user do
      conn
    else
      conn
      |> put_status(:unauthorized)
      |> Phoenix.Controller.put_view(DataDigestWeb.ErrorView)
      |> Phoenix.Controller.render(:"401")
      |> halt
    end
  end
end
