defmodule DataDigestWeb.SubscriberController do
  use DataDigestWeb, :controller

  alias DataDigest.Digests
  alias DataDigest.Digests.Subscriber

  def index(conn, %{"digest_id" => digest_id}) do
    digest = Digests.get_digest!(digest_id)
    subscribers = Digests.list_subscribers()
    render(conn, "index.html", digest: digest, subscribers: subscribers)
  end

  def new(conn, %{"digest_id" => digest_id}) do
    digest = Digests.get_digest!(digest_id)
    changeset = Digests.change_subscriber(%Subscriber{})
    render(conn, "new.html", digest: digest, changeset: changeset)
  end

  def create(conn, %{"digest_id" => digest_id, "subscriber" => subscriber_params}) do
    digest = Digests.get_digest!(digest_id)
    case Digests.create_subscriber(subscriber_params) do
      {:ok, subscriber} ->
        conn
        |> put_flash(:info, "Subscriber created successfully.")
        |> redirect(to: Routes.digest_subscriber_path(conn, :show, digest.id, subscriber))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", digest: digest, changeset: changeset)
    end
  end

  def show(conn, %{"digest_id" => digest_id, "id" => id}) do
    digest = Digests.get_digest!(digest_id)
    subscriber = Digests.get_subscriber!(id)
    render(conn, "show.html", digest: digest, subscriber: subscriber)
  end

  def edit(conn, %{"digest_id" => digest_id, "id" => id}) do
    digest = Digests.get_digest!(digest_id)
    subscriber = Digests.get_subscriber!(id)
    changeset = Digests.change_subscriber(subscriber)
    render(conn, "edit.html", digest: digest, subscriber: subscriber, changeset: changeset)
  end

  def update(conn, %{"digest_id" => digest_id, "id" => id, "subscriber" => subscriber_params}) do
    digest = Digests.get_digest!(digest_id)
    subscriber = Digests.get_subscriber!(id)

    case Digests.update_subscriber(subscriber, subscriber_params) do
      {:ok, subscriber} ->
        conn
        |> put_flash(:info, "Subscriber updated successfully.")
        |> redirect(to: Routes.digest_subscriber_path(conn, :show, digest.id, subscriber))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", digest: digest, subscriber: subscriber, changeset: changeset)
    end
  end

  def delete(conn, %{"digest_id" => digest_id, "id" => id}) do
    digest = Digests.get_digest!(digest_id)
    subscriber = Digests.get_subscriber!(id)
    {:ok, _subscriber} = Digests.delete_subscriber(subscriber)

    conn
    |> put_flash(:info, "Subscriber deleted successfully.")
    |> redirect(to: Routes.digest_subscriber_path(conn, :index, digest.id))
  end
end
