defmodule DataDigestQueue.JobsSubscriber do
  use Conduit.Subscriber

  def process(message, _opts) do
    # Code to process the message
    IO.inspect message
    message
  end
end
