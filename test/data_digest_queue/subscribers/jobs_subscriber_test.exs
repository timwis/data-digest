defmodule DataDigestQueue.JobsSubscriberTest do
  use ExUnit.Case
  use Conduit.Test
  import Conduit.Message
  alias Conduit.Message
  alias DataDigestQueue.JobsSubscriber

  describe "process/2" do
    test "returns acked message" do
      message =
        %Message{}
        |> put_body("foo")

      assert %Message{status: :ack} = JobsSubscriber.run(message)
    end
  end
end
