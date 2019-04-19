defmodule DataDigest.DigestJobsTest do
  use DataDigest.DataCase

  alias DataDigest.DigestJobs

  describe "digest jobs" do
    test "list_digest_jobs/0 returns unique digest jobs with aggregated emails" do
      user = user_fixture()
      digest1 = digest_fixture(user, slug: "one")
      digest2 = digest_fixture(user, slug: "two")
      subscriber_fixture(digest1, email: "a@a.a")
      subscriber_fixture(digest1, email: "b@b.b")
      subscriber_fixture(digest2, email: "c@c.c")

      digest_jobs = DigestJobs.list_digest_jobs()
      assert is_list(digest_jobs)
      [ first | [ second | _ ] ] = digest_jobs
      assert ["a@a.a", "b@b.b"] == first.emails
      assert ["c@c.c"] = second.emails
    end

    test "get_url/1 renders url using template" do
      user = user_fixture()
      digest = digest_fixture(user, endpoint_template: "https://test.com/{{params.a}}?q={{params.b}}")
      subscriber_fixture(digest, params: %{"a" => "foo", "b" => "bar"})
      [ digest_job | _ ] = DigestJobs.list_digest_jobs()
      expected = "https://test.com/foo?q=bar"
      assert expected == DigestJobs.get_url(digest_job)
    end
  end
end
