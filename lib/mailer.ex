defmodule DataDigest.Mailer do
  use Bamboo.Mailer, otp_app: :data_digest
  import Bamboo.Email

  @from "noreply@datadigest.app"

  def send_digest_job(%{:to => to, :body => body, :subject => subject}) do
    IO.puts "Sending digest"
    new_email(
      to: to,
      from: @from,
      subject: subject,
      html_body: body
    )
    |> deliver_now
  end

end
