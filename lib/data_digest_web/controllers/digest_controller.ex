defmodule DataDigestWeb.DigestController do
  use DataDigestWeb, :controller

  alias DataDigest.Digests
  alias DataDigest.Digests.Digest
  alias DataDigestQueue.Broker
  alias Conduit.Message
  alias DataDigest.DigestJobs

  def index(conn, _params) do
    digests = Digests.list_digests()
    render(conn, "index.html", digests: digests)
  end
  
  def schedule(conn, _params) do
    digest_jobs = DigestJobs.list_digest_jobs()
    Enum.map(digest_jobs, fn digest_job ->
      %Message{}
      |> Message.put_body(digest_job)
      |> Broker.publish(:jobs)
    end)
    render(conn, "index.html", digests: [])
  end

  def new(conn, _params) do
    changeset = Digests.change_digest(%Digest{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"digest" => digest_params}) do
    case Digests.create_digest(digest_params) do
      {:ok, digest} ->
        conn
        |> put_flash(:info, "Digest created successfully.")
        |> redirect(to: Routes.digest_path(conn, :show, digest))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    digest = Digests.get_digest!(id)
    render(conn, "show.html", digest: digest)
  end

  def edit(conn, %{"id" => id}) do
    digest = Digests.get_digest!(id)
    changeset = Digests.change_digest(digest)
    render(conn, "edit.html", digest: digest, changeset: changeset)
  end

  def update(conn, %{"id" => id, "digest" => digest_params}) do
    digest = Digests.get_digest!(id)

    case Digests.update_digest(digest, digest_params) do
      {:ok, digest} ->
        conn
        |> put_flash(:info, "Digest updated successfully.")
        |> redirect(to: Routes.digest_path(conn, :show, digest))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", digest: digest, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    digest = Digests.get_digest!(id)
    {:ok, _digest} = Digests.delete_digest(digest)

    conn
    |> put_flash(:info, "Digest deleted successfully.")
    |> redirect(to: Routes.digest_path(conn, :index))
  end
end
