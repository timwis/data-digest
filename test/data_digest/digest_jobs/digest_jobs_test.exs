defmodule DataDigest.DigestJobsTest do
  use DataDigest.DataCase

  alias DataDigest.Digests
  alias DataDigest.DigestJobs

  describe "digest jobs" do
    @valid_digest_attrs %{body_template: "some body_template", endpoint_template: "some endpoint_template", name: "some name", params_schema: %{}, slug: "some slug", subject_template: "some subject_template"}
    @valid_subscriber_attrs %{email: "some email", params: %{"foo" => "bar"}}

    def digest_fixture(attrs \\ %{}) do
      {:ok, digest} =
        attrs
        |> Enum.into(@valid_digest_attrs)
        |> Digests.create_digest()

      digest
    end

    def subscriber_fixture(attrs \\ %{}) do
      {:ok, subscriber} =
        attrs
        |> Enum.into(@valid_subscriber_attrs)
        |> Digests.create_subscriber()

      subscriber
    end

    test "list_digest_jobs/0 returns unique digest jobs with aggregated emails" do
      digest1 = digest_fixture(slug: "one")
      digest2 = digest_fixture(slug: "two")
      subscriber_fixture(digest_id: digest1.id, email: "a@a.a")
      subscriber_fixture(digest_id: digest1.id, email: "b@b.b")
      subscriber_fixture(digest_id: digest2.id, email: "c@c.c")

      digest_jobs = DigestJobs.list_digest_jobs()
      assert is_list(digest_jobs)
      [ first | [ second | _ ] ] = digest_jobs
      assert ["a@a.a", "b@b.b"] == first.emails
      assert ["c@c.c"] = second.emails
    end

    test "get_url/1 renders url using template" do
      digest = digest_fixture(endpoint_template: "https://test.com/{{params.a}}?q={{params.b}}")
      subscriber_fixture(digest_id: digest.id, params: %{"a" => "foo", "b" => "bar"})
      [ digest_job | _ ] = DigestJobs.list_digest_jobs()
      expected = "https://test.com/foo?q=bar"
      assert expected == DigestJobs.get_url(digest_job)
    end
  end
end
