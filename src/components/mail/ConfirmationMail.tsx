import { Booking, Session } from "@/types";
import config from "@/utils/config";
import { timeSlots } from "@/utils/timeSlots";
import {
  Body,
  Container,
  Head,
  Html,
  Markdown,
  Preview,
} from "@react-email/components";
import fs from "fs";
import { getLocale } from "next-intl/server";
import path from "path";
import * as React from "react";

interface ConfirmationEmailProps {
  subject: string;
  booking: Booking;
  session: Session;
}

function loadConfirmationEmail(): string {
  const filePath = path.join(
    process.cwd(),
    "messages/",
    config.defaultLocale,
    "/confirmation-email.md"
  );
  return fs.readFileSync(filePath, "utf8");
}

function loadConfirmationEmailPanel(): string {
  const filePath = path.join(
    process.cwd(),
    "messages/",
    config.defaultLocale,
    "/confirmation-email-panel.md"
  );
  return fs.readFileSync(filePath, "utf8");
}

function interpolateMarkdown(
  template: string,
  variables: Record<string, string | number>
) {
  return template.replace(/{{(.*?)}}/g, (_, key) =>
    String(variables[key.trim()] ?? "")
  );
}

export const ConfirmationEmail: React.FC<ConfirmationEmailProps> = async ({
  subject,
  booking,
  session,
}) => {
  const locale = await getLocale();
  const { name, seats, id: bookingId } = booking;
  const { title, timeSlot } = session;

  const selectedTimeSlot = timeSlots[timeSlot];
  const bookingUrl = `${config.baseUrl}/bookings/${bookingId}`;

  const rawMarkdown = session.isPanel
    ? loadConfirmationEmailPanel()
    : loadConfirmationEmail();
  const markdownContent = interpolateMarkdown(rawMarkdown, {
    name,
    seats,
    seatSuffix: Number(seats) === 1 ? "o" : "i",
    title,
    time: selectedTimeSlot.time,
    date: selectedTimeSlot.date,
    bookingUrl,
    mail: config.mailContact,
  });

  return (
    <Html lang={locale}>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.4" }}>
        <Container>
          <Markdown>{markdownContent}</Markdown>
        </Container>
      </Body>
    </Html>
  );
};
