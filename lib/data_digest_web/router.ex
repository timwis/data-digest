defmodule DataDigestWeb.Router do
  use DataDigestWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", DataDigestWeb do
    pipe_through :browser

    get "/", PageController, :index
    resources "/digests", DigestController do
      resources "/subscribers", SubscriberController
    end
    get "/schedule", DigestController, :schedule
  end

  # Other scopes may use custom stacks.
  # scope "/api", DataDigestWeb do
  #   pipe_through :api
  # end
end
