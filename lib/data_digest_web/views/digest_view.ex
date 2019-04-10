defmodule DataDigestWeb.DigestView do
  use DataDigestWeb, :view

  def render("schedule.json", %{digest_jobs: digest_jobs}) do
    digest_jobs
  end
end
