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
        Enum.map(digest_job.emails, fn email ->
          digest_job
          |> DigestJobs.render_email(email, data)
          |> Mailer.send_digest_job()
        end)

      {:error, reason} ->
        Logger.error "Error fetching data: #{to_string(reason)}"
    end

    message
  end

  defp parse_digest_job(body) do
    body
      |> Enum.map(fn { key, val } -> { String.to_existing_atom(key), val } end)
      |> Enum.into(%{})
      |> (& struct!(DigestJob, &1)).()
  end
end
