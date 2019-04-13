defmodule DataDigestWeb.DigestView do
  use DataDigestWeb, :view
  alias DataDigestWeb.DigestView

  def render("index.json", %{digests: digests}) do
    %{data: render_many(digests, DigestView, "digest.json")}
  end

  def render("show.json", %{digest: digest}) do
    %{data: render_one(digest, DigestView, "digest.json")}
  end

  def render("digest.json", %{digest: digest}) do
    %{id: digest.id,
      slug: digest.slug,
      name: digest.name,
      params_schema: digest.params_schema,
      endpoint_template: digest.endpoint_template,
      subject_template: digest.subject_template,
      body_template: digest.body_template}
  end

  def render("schedule.json", %{digest_jobs: digest_jobs}) do
    digest_jobs
  end
end
