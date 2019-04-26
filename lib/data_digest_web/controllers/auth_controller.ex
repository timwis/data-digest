defmodule DataDigestWeb.AuthController do
  @moduledoc """
  Auth controller responsible for handling Ueberauth responses
  """

  use DataDigestWeb, :controller
  plug Ueberauth
  alias DataDigest.Accounts

  def show(%{assigns: %{current_user: current_user}} = conn, _params) do
    render(conn, "current_user.json", user: current_user)
  end

  def callback(%{assigns: %{ueberauth_auth: auth}, query_params: %{"redirect" => redirect_path}} = conn, _params) do
    conn
    |> authenticate(auth)
    |> redirect(to: redirect_path)
  end

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    conn
    |> authenticate(auth)
    |> redirect(to: "/")
  end

  defp authenticate(conn, auth) do
    with {:ok, user} <- Accounts.get_or_create_user(auth) do
      conn
      |> put_session(:user_id, user.id)
      |> configure_session(renew: true)
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
