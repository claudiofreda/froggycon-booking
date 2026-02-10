import { BookingForm } from "@/components/booking/BookingForm";
import { TermsAndConditions } from "@/components/input/TermsAndConditions";
import { SessionCard } from "@/components/session/SessionCard";
import { getSessionById } from "@/lib/sessions";
import { Session } from "@/types";
import config from "@/utils/config";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import fs from "fs";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import path from "path";

export const dynamic = "force-dynamic";

const BackButton = () => {
  const t = useTranslations("SessionSelected");

  return (
    <section className="flex items-center space-x-4 my-4">
      <Link href="/">
        <button type="button" className="btn">
          <ArrowLeftIcon className="w-6 h-6" />
          {t("backButton")}
        </button>
      </Link>
    </section>
  );
};

export default async function SessionSelected({
  params,
}: {
  params: { sessionId: Session["id"] };
}) {
  const t = await getTranslations("SessionSelected");

  const { sessionId } = params;
  const selectedSession = await getSessionById(sessionId);

  if (!selectedSession) {
    return <p>{t("notFound")}</p>;
  }

  const filePath = path.join(
    process.cwd(),
    "messages/",
    config.defaultLocale,
    "/terms-and-conditions.md"
  );

  const termsAndConditions = fs.readFileSync(filePath, "utf8");

  return (
    <>
      <BackButton />

      {selectedSession && (
        <>
          <SessionCard {...selectedSession} expanded />

          {selectedSession.availableSeats === 0 ? (
            <section className="mt-4">
              <p>
                <strong>{t("noSeatsAvailable")}</strong>
              </p>
              <BackButton />
            </section>
          ) : (
            <BookingForm
              selectedSession={selectedSession}
              termsAndConditions={
                <TermsAndConditions termsAndConditions={termsAndConditions} />
              }
            />
          )}
        </>
      )}
    </>
  );
}
