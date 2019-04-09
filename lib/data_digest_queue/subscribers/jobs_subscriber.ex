defmodule DataDigestQueue.JobsSubscriber do
  use Conduit.Subscriber
  alias DataDigest.Digests

  def process(message, _opts) do
    # Code to process the message
    IO.inspect message.body
    Digests.fetch_and_send_digest(message.body)
    message
  end
end
