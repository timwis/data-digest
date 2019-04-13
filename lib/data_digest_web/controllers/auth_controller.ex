defmodule DataDigestWeb.AuthController do
  @moduledoc """
  Auth controller responsible for handling Ueberauth responses
  """

  use DataDigestWeb, :controller
  plug Ueberauth
  alias DataDigest.Accounts

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    with {:ok, user} <- Accounts.get_or_create_user(auth) do
      conn
      |> put_session(:current_user, user)
      |> render("current_user.json", user: user)
    end
  end

  def callback(%{assigns: %{ueberauth_failure: _fails}} = conn, _params) do
    conn
    |> send_resp(:unauthorized, "")
  end

  def delete(conn, _params) do
    conn
    |> configure_session(drop: true)
    |> send_resp(:no_content, "")
  end
end
