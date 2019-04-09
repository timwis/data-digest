defmodule DataDigest.DigestJobs.DigestJob do
  @derive Jason.Encoder # all fields
  defstruct [:emails,
            :params,
            :endpoint_template,
            :subject_template,
            :body_template,
            :digest_id]
end
