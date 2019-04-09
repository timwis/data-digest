defmodule DataDigestQueue.JobsSubscriber do
  use Conduit.Subscriber
  alias DataDigest.DigestJobs
  alias DataDigest.Mailer
  alias DataDigest.DigestJobs.DigestJob

  def process(message, _opts) do
    # Code to process the message
    digest_job = parse_digest_job(message.body)
    IO.inspect digest_job

    # DigestJobs.fetch_and_send_digest_job(digest_job)
    DigestJobs.get_url(digest_job)
      |> DigestJobs.fetch_data
      |> DigestJobs.render_email(digest_job)
      |> Mailer.send_digest_job

    message
  end

  def parse_digest_job(body) do
    body
      |> Enum.map(fn { key, val } -> { String.to_existing_atom(key), val } end)
      |> Enum.into(%{})
      |> (& struct!(DigestJob, &1)).()
  end
end
