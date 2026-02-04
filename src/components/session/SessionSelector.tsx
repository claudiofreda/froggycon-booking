"use client";

import { Loader } from "@/components/Loader";
import { SessionCard } from "@/components/session/SessionCard";
import { SessionTimeSlotSelector } from "@/components/session/SessionTimeSlotSelector";
import { useFilteredSessions } from "@/hooks/useFilteredSessions";
import { useSessions } from "@/hooks/useSessions";
import { Session } from "@/types";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "use-intl";

export const SessionSelector: React.FC<{
  baseUrl?: string;
}> = ({ baseUrl = "/session" }) => {
  const [timeSlots, setTimeSlots] = useState<Session["timeSlot"][]>([]);
  const [search, setSearch] = useState<string>("");

  const { data: sessions, loading, error } = useSessions();

  const filtered = useFilteredSessions(sessions, timeSlots, search);

  const t = useTranslations("Components.SessionSelector");

  if (loading) return <Loader />;

  if (!sessions || error) return <p>{t("error")}</p>;

  return (
    <>
      <section className="flex md:flex-row flex-col flex-wrap md:justify-between -m-2 pb-4">
        <section className="m-2">
          <SessionTimeSlotSelector
            selectTimeSlots={setTimeSlots}
            selectedTimeSlots={timeSlots}
          />
        </section>

        <label className="flex items-center gap-2 m-2 input-bordered input">
          <input
            type="text"
            placeholder={t("search")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full"
          />
          {
            <button
              className={`m-0 p-0 w-6 h-6 min-h-0 btn btn-circle ${
                search
                  ? "opacity-1 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <XMarkIcon className="w-4 h-4" onClick={() => setSearch("")} />
            </button>
          }
          <MagnifyingGlassIcon className="w-6 h-6 text-neutral-400" />
        </label>
      </section>

      <section className="gap-8 grid grid-cols-1 md:grid-cols-2">
        {filtered.map((session: Session) => (
          <Link key={session.id} href={`${baseUrl}/${session.id}`}>
            <SessionCard {...session} selectable />
          </Link>
        ))}
      </section>
    </>
  );
};
