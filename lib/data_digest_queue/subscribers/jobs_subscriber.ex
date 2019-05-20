defmodule DataDigestQueue.JobsSubscriber do
  use Conduit.Subscriber
  alias DataDigest.DigestJobs
  alias DataDigest.Mailer
  alias DataDigest.DigestJobs.DigestJob
  require Logger

  def process(message, _opts) do
    digest_job = parse_digest_job(message.body)
    IO.inspect digest_job # TODO: Use Logger.info

    url = DigestJobs.get_url(digest_job)
    case DigestJobs.fetch_data(url) do
      {:ok, data} ->
        Enum.map(digest_job.subscribers, fn subscriber ->
          digest_job
          |> DigestJobs.render_email(subscriber, data)
          |> Mailer.send_digest_job()
        end)

      {:error, reason} ->
        Logger.error "Error fetching data: #{to_string(reason)}"
    end

    message
  end

  defp parse_digest_job(body) do
    body = use_atom_keys(body)
    struct!(DigestJob, %{body | subscribers: Enum.map(body.subscribers, &use_atom_keys/1)})
  end

  defp use_atom_keys(data) do
    data
    |> Enum.map(fn { key, val } -> { String.to_existing_atom(key), val } end)
    |> Enum.into(%{})
  end
end
