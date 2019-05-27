defmodule DataDigestWeb.UnsubscribeController do
  use DataDigestWeb, :controller

  alias DataDigest.Digests
  alias DataDigest.Digests.Subscriber

  def show(conn, %{"token" => token}) do
    subscriber = get_subscriber_from_token(token)
    render(conn, "show.json", subscriber: subscriber)
  end

  def delete(conn, %{"token" => token}) do
    subscriber = get_subscriber_from_token(token)

    with {:ok, %Subscriber{}} <- Digests.delete_subscriber(subscriber) do
      send_resp(conn, :no_content, "")
    end
  end

  defp get_subscriber_from_token(token) do
    one_month = 60 * 60 * 24 * 30
    {:ok, subscriber_id} = Phoenix.Token.verify(DataDigestWeb.Endpoint, "unsubscribe", token, max_age: one_month)
    Digests.get_subscriber!(subscriber_id)
  end
end
