defmodule DataDigestWeb.Digest.SubscriberController do
  use DataDigestWeb, :controller

  alias DataDigest.Digests
  alias DataDigest.Digests.Subscriber

  action_fallback DataDigestWeb.FallbackController

  def index(conn, %{"digest_id" => digest_id}) do
    digest = Digests.get_digest!(digest_id)
    subscribers = Digests.list_subscribers()
    render(conn, "index.json", digest: digest, subscribers: subscribers)
  end

  def create(conn, %{"digest_id" => digest_id, "subscriber" => subscriber_params}) do
    digest = Digests.get_digest!(digest_id)
    params = Map.put(subscriber_params, "digest_id", digest.id)

    with {:ok, %Subscriber{} = subscriber} <- Digests.create_subscriber(params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.digest_subscriber_path(conn, :show, digest.id, subscriber))
      |> render("show.json", subscriber: subscriber)
    end
  end

  def show(conn, %{"digest_id" => digest_id, "id" => id}) do
    digest = Digests.get_digest!(digest_id)
    subscriber = Digests.get_subscriber!(id)
    render(conn, "show.json", digest: digest, subscriber: subscriber)
  end

  def update(conn, %{"id" => id, "subscriber" => subscriber_params}) do
    subscriber = Digests.get_subscriber!(id)

    with {:ok, %Subscriber{} = subscriber} <- Digests.update_subscriber(subscriber, subscriber_params) do
      render(conn, "show.json", subscriber: subscriber)
    end
  end

  def delete(conn, %{"id" => id}) do
    subscriber = Digests.get_subscriber!(id)

    with {:ok, %Subscriber{}} <- Digests.delete_subscriber(subscriber) do
      send_resp(conn, :no_content, "")
    end
  end
end
