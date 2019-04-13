defmodule DataDigestWeb.Digest.SubscriberView do
  use DataDigestWeb, :view
  alias DataDigestWeb.Digest.SubscriberView

  def render("index.json", %{subscribers: subscribers}) do
    %{data: render_many(subscribers, SubscriberView, "subscriber.json")}
  end

  def render("show.json", %{subscriber: subscriber}) do
    %{data: render_one(subscriber, SubscriberView, "subscriber.json")}
  end

  def render("subscriber.json", %{subscriber: subscriber}) do
    %{id: subscriber.id,
      email: subscriber.email,
      params: subscriber.params}
  end
end
