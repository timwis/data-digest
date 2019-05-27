defmodule DataDigestWeb.UnsubscribeView do
  use DataDigestWeb, :view
  alias DataDigestWeb.UnsubscribeView

  def render("show.json", %{subscriber: subscriber}) do
    %{
      data: %{
        id: subscriber.id,
        email: subscriber.email,
        digest: %{
          id: subscriber.digest.id,
          name: subscriber.digest.name
        },
        inserted_at: subscriber.inserted_at
      }
    }
  end
end
