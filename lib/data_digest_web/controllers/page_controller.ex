defmodule DataDigestWeb.PageController do
  use DataDigestWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html", current_user: get_session(conn, :current_user))
  end
end
