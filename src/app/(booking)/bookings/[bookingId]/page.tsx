import NotFound from "@/app/not-found";
import { BookingDeleteButton } from "@/components/booking/BookingDeleteButton";
import { BookingForm } from "@/components/booking/BookingForm";
import { TermsAndConditions } from "@/components/input/TermsAndConditions";
import { PageTitle } from "@/components/PageTitle";
import { SessionCard } from "@/components/session/SessionCard";
import { getBookingById } from "@/lib/bookings";
import { getSessionById } from "@/lib/sessions";
import { Booking } from "@/types";
import config from "@/utils/config";
import fs from "fs";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import path from "path";

export const dynamic = "force-dynamic";

export default async function BookingDetails({
  params,
}: {
  params: { bookingId: Booking["id"] };
}) {
  const t = await getTranslations({ namespace: "BookingDetails" });

  const { bookingId } = params;
  const booking = await getBookingById(bookingId);

  if (!booking)
    return (
      <NotFound
        description={t("NotFound.description")}
        ctaLabel={t("NotFound.ctaLabel")}
      />
    );

  const selectedSession = await getSessionById(booking.sessionId);

  const sessionSelectionPath = `/bookings/${bookingId}/session`;
  if (!selectedSession) redirect(sessionSelectionPath);

  const filePath = path.join(
    process.cwd(),
    "messages/",
    config.defaultLocale,
    "/terms-and-conditions.md"
  );

  const termsAndConditions = fs.readFileSync(filePath, "utf8");

  return (
    <>
      <PageTitle title={t("title")} />

      <SessionCard {...selectedSession} expanded />

      <BookingForm
        defaultBooking={booking}
        selectedSession={selectedSession}
        termsAndConditions={
          <TermsAndConditions termsAndConditions={termsAndConditions} />
        }
      />

      <section className="mt-4">
        <BookingDeleteButton bookingId={booking.id} />
      </section>
    </>
  );
}
