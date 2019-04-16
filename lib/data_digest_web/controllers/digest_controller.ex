defmodule DataDigestWeb.DigestController do
  use DataDigestWeb, :controller

  alias DataDigest.Digests
  alias DataDigest.Digests.Digest
  alias DataDigest.DigestJobs
  alias Conduit.Message
  alias DataDigestQueue.Broker

  action_fallback DataDigestWeb.FallbackController
  plug :require_auth! when action in [:show]

  def index(conn, _params) do
    digests = Digests.list_digests()
    render(conn, "index.json", digests: digests)
  end

  def create(conn, %{"digest" => digest_params}) do
    with {:ok, %Digest{} = digest} <- Digests.create_digest(digest_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.digest_path(conn, :show, digest))
      |> render("show.json", digest: digest)
    end
  end

  def show(conn, %{"id" => id}) do
    digest = Digests.get_digest!(id)
    render(conn, "show.json", digest: digest)
  end

  def update(conn, %{"id" => id, "digest" => digest_params}) do
    digest = Digests.get_digest!(id)

    with {:ok, %Digest{} = digest} <- Digests.update_digest(digest, digest_params) do
      render(conn, "show.json", digest: digest)
    end
  end

  def delete(conn, %{"id" => id}) do
    digest = Digests.get_digest!(id)

    with {:ok, %Digest{}} <- Digests.delete_digest(digest) do
      send_resp(conn, :no_content, "")
    end
  end 

  def schedule(conn, _params) do
    digest_jobs = DigestJobs.list_digest_jobs()
    Enum.map(digest_jobs, fn digest_job ->
      %Message{}
      |> Message.put_body(digest_job)
      |> Broker.publish(:jobs)
    end)
    render(conn, "schedule.json", digest_jobs: digest_jobs)
  end
end
