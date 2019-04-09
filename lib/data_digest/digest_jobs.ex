defmodule DataDigest.DigestJobs do
  @moduledoc """
  The Digest Jobs context.
  """

  import Ecto.Query, warn: false
  alias DataDigest.Repo

  alias DataDigest.Digests
  alias DataDigest.DigestJobs.DigestJob

  @doc """
  Returns the list of digest jobs.

  ## Examples

      iex> list_digest_jobs()
      [%DigestJob{}, ...]

  """
  def list_digest_jobs() do
    query = from s in Digests.Subscriber,
            join: d in Digests.Digest,
            on: d.id == s.digest_id,
            select: %DigestJob{
              emails: fragment("array_agg(?)", s.email),
              params: s.params,
              endpoint_template: d.endpoint_template,
              subject_template: d.subject_template,
              body_template: d.body_template,
              digest_id: s.digest_id
            },
            group_by: [
              s.digest_id,
              s.params,
              d.endpoint_template,
              d.subject_template,
              d.body_template
            ],
            order_by: [s.digest_id, s.params] # persistent order for tests
    Repo.all(query)
  end

  def get_url(%DigestJob{endpoint_template: endpoint_template, params: params}) do
    {:ok, url, _} = Liquid.Template.parse(endpoint_template)
      |> Liquid.Template.render(%{"params" => params})
    url
  end

  def fetch_data(url) do
    case HTTPoison.get(url) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        Poison.decode!(body)
      {:ok, %HTTPoison.Response{status_code: 404}} ->
        IO.puts "URL not found"
      {:error, %HTTPoison.Error{reason: reason}} ->
        IO.inspect reason
    end
  end

  def render_email(data, %DigestJob{params: params, subject_template: subject_template, body_template: body_template, emails: emails}) do
    payload = %{"data" => data, "params" => params}

    {:ok, subject, _} = Liquid.Template.parse(subject_template)
      |> Liquid.Template.render(payload)

    {:ok, body, _} = Liquid.Template.parse(body_template)
      |> Liquid.Template.render(payload)

    %{subject: subject, body: body, to: emails}
  end
end
