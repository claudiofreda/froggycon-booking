import { ConfirmationEmail } from "@/components/ConfirmationMail";
import { Adventure, Booking } from "@/types";
import { render } from "@react-email/render";
import { Resend } from "resend";

const resendEnabled = process.env.RESEND_ENABLED;
const resend = new Resend(process.env.RESEND_API_KEY);
const sender = process.env.MAIL_SENDER;

export async function sendConfirmationEmail({
  booking,
  adventure,
  update,
}: {
  booking: Booking;
  adventure: Adventure;
  update?: boolean;
}) {
  const { email } = booking;
  if (!resendEnabled) return;

  const subject = update
    ? "Conferma Modifica Prenotazione FroggyCon III"
    : "Conferma Prenotazione FroggyCon III";

  const emailHtml = await render(
    <ConfirmationEmail
      subject={subject}
      booking={booking}
      adventure={adventure}
    />
  );

  return resend.emails.send({
    from: sender as string,
    to: email,
    subject,
    html: emailHtml,
  });
}
