defmodule DataDigestWeb.Digest.SubscriberController do
  use DataDigestWeb, :controller

  alias DataDigest.Digests
  alias DataDigest.Digests.Subscriber

  action_fallback DataDigestWeb.FallbackController
  plug :require_auth! when action in [:index, :show, :update, :delete]

  def action(conn, _) do
    args = [conn, conn.params, conn.assigns.current_user]
    apply(__MODULE__, action_name(conn), args)
  end

  def index(conn, %{"digest_id" => digest_id}, current_user) do
    digest = Digests.get_user_digest!(current_user, digest_id)
    subscribers = Digests.list_digest_subscribers(digest)
    render(conn, "index.json", subscribers: subscribers)
  end

  def create(conn, %{"digest_id" => digest_id, "subscriber" => params}, _current_user) do
    digest = Digests.get_digest!(digest_id)

    with {:ok, %Subscriber{} = subscriber} <- Digests.create_subscriber(digest, params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.digest_subscriber_path(conn, :show, digest.id, subscriber))
      |> render("show.json", subscriber: subscriber)
    end
  end

  def show(conn, %{"digest_id" => digest_id, "id" => id}, current_user) do
    digest = Digests.get_user_digest!(current_user, digest_id)
    subscriber = Digests.get_digest_subscriber!(digest, id)
    render(conn, "show.json", subscriber: subscriber)
  end

  def update(conn, %{"digest_id" => digest_id, "id" => id, "subscriber" => subscriber_params}, current_user) do
    digest = Digests.get_user_digest!(current_user, digest_id)
    subscriber = Digests.get_digest_subscriber!(digest, id)

    with {:ok, %Subscriber{} = subscriber} <- Digests.update_subscriber(subscriber, subscriber_params) do
      render(conn, "show.json", subscriber: subscriber)
    end
  end

  def delete(conn, %{"digest_id" => digest_id, "id" => id}, current_user) do
    digest = Digests.get_user_digest!(current_user, digest_id)
    subscriber = Digests.get_digest_subscriber!(digest, id)

    with {:ok, %Subscriber{}} <- Digests.delete_subscriber(subscriber) do
      send_resp(conn, :no_content, "")
    end
  end
end
