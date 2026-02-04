import { ConfirmationEmail } from "@/components/mail/ConfirmationMail";
import { Booking, Session } from "@/types";
import config from "@/utils/config";
import { render } from "@react-email/render";
import { Resend } from "resend";

const resend = new Resend(config.resendApiKey);

export async function sendConfirmationEmail({
  booking,
  session,
  update,
}: {
  booking: Booking;
  session: Session;
  update?: boolean;
}) {
  const { email } = booking;
  if (!config.resendEnabled) return;

  const subject = update
    ? "Conferma Modifica Prenotazione FroggyCon III"
    : "Conferma Prenotazione FroggyCon III";

  const emailHtml = await render(
    <ConfirmationEmail subject={subject} booking={booking} session={session} />
  );

  return resend.emails.send({
    from: config.mailSender,
    to: email,
    subject,
    html: emailHtml,
  });
}
