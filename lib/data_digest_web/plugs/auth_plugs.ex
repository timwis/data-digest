defmodule DataDigestWeb.AuthPlugs do
  import Plug.Conn
  alias DataDigest.Accounts

  def load_auth(conn, _opts) do
    user_id = get_session(conn, :user_id)
    user = user_id && Accounts.get_user(user_id)
    assign(conn, :current_user, user)
  end

  def require_auth!(conn, _opts) do
    if conn.assigns.current_user do
      conn
    else
      conn
      |> send_resp(:unauthorized, "")
      |> halt
    end
  end
end
