defmodule DataDigestWeb.AuthView do
  @moduledoc false

  use DataDigestWeb, :view

  def render("current_user.json", %{user: user}) do
    %{data: user}
  end
end
