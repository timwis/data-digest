defmodule DataDigestWeb.DigestController do
  use DataDigestWeb, :controller

  alias DataDigest.Digests
  alias DataDigest.Digests.Digest
  alias DataDigest.DigestJobs
  alias Conduit.Message
  alias DataDigestQueue.Broker

  action_fallback DataDigestWeb.FallbackController
  plug :require_auth! when action in [:index, :show, :create, :update, :delete]

  def action(conn, _) do
    args = [conn, conn.params, conn.assigns.current_user]
    apply(__MODULE__, action_name(conn), args)
  end

  def index(conn, _params, current_user) do
    digests = Digests.list_user_digests(current_user)
    render(conn, "index.json", digests: digests)
  end

  def create(conn, %{"digest" => digest_params}, current_user) do
    with {:ok, %Digest{} = digest} <- Digests.create_digest(current_user, digest_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.digest_path(conn, :show, digest))
      |> render("show.json", digest: digest)
    end
  end

  def show(conn, %{"id" => id}, current_user) do
    digest = Digests.get_user_digest!(current_user, id)
    render(conn, "show.json", digest: digest)
  end

  def update(conn, %{"id" => id, "digest" => digest_params}, current_user) do
    digest = Digests.get_user_digest!(current_user, id)

    with {:ok, %Digest{} = digest} <- Digests.update_digest(digest, digest_params) do
      render(conn, "show.json", digest: digest)
    end
  end

  def delete(conn, %{"id" => id}, current_user) do
    digest = Digests.get_user_digest!(current_user, id)

    with {:ok, %Digest{}} <- Digests.delete_digest(digest) do
      send_resp(conn, :no_content, "")
    end
  end 

  def schedule(conn, _params, _current_user) do
    digest_jobs = DigestJobs.list_digest_jobs()
    Enum.map(digest_jobs, fn digest_job ->
      %Message{}
      |> Message.put_body(digest_job)
      |> Broker.publish(:jobs)
    end)
    render(conn, "schedule.json", digest_jobs: digest_jobs)
  end
end
