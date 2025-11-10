import { Booking, Session } from "@/types";
import { TimeSlot } from "@/utils/timeSlots";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { Pie } from "./Pie";

export const Totals: FC<{ bookings: Booking[]; sessions: Session[] }> = ({
  bookings,
  sessions,
}) => {
  const t = useTranslations("Components.Totals");

  const calculateTotal = (timeSlots: TimeSlot[]) => {
    const filteredSessions = sessions
      .filter(({ isPanel }) => !isPanel)
      .filter(({ timeSlot }) => timeSlots.includes(timeSlot))
      .map((item) => {
        const bookedSeats = bookings
          .filter(({ sessionId }) => sessionId === item.id)
          .reduce((total, { seats }) => total + (seats || 0), 0);

        return {
          ...item,
          bookedSeats,
        };
      });

    const totalSeats = filteredSessions.reduce(
      (total, { maxPlayers }) => total + (maxPlayers || 0),
      0
    );

    const bookedSeats = filteredSessions.reduce(
      (total, { bookedSeats }) => total + (bookedSeats || 0),
      0
    );

    const totalPercentage = totalSeats
      ? ((bookedSeats / totalSeats) * 100).toFixed(2)
      : "0.00";

    const ready = filteredSessions.filter(
      ({ bookedSeats, minPlayers, maxPlayers }) => {
        return bookedSeats >= (minPlayers || 3) && bookedSeats < maxPlayers;
      }
    ).length;

    const complete = filteredSessions.filter(({ bookedSeats, maxPlayers }) => {
      return bookedSeats === maxPlayers;
    }).length;

    const available = filteredSessions.filter(({ bookedSeats, minPlayers }) => {
      return bookedSeats > 0 && bookedSeats < minPlayers;
    }).length;

    const free = filteredSessions.filter(({ bookedSeats }) => {
      return bookedSeats === 0;
    }).length;

    const totalSessions = filteredSessions.length;

    const readyPercentage = totalSeats
      ? ((ready / totalSessions) * 100).toFixed(2)
      : "0.00";

    return {
      bookedSeats,
      totalSeats,
      totalPercentage,
      ready,
      complete,
      available,
      free,
      totalSessions,
      readyPercentage,
    };
  };

  const allTimeSlots = Object.values(TimeSlot).filter(
    (value): value is TimeSlot => Object.values(TimeSlot).includes(value)
  );

  const {
    bookedSeats,
    totalSeats,
    totalPercentage,
    ready,
    complete,
    available,
    free,
    totalSessions,
    readyPercentage,
  } = calculateTotal(allTimeSlots);

  return (
    <section className="space-y-4">
      <section>
        <div>
          <b>Totale Prenotazioni:</b> {bookedSeats}/{totalSeats} (
          {totalPercentage}
          %)
        </div>
        <div>
          {t("readyToStart")}: {ready + complete}/{totalSessions} (
          {readyPercentage}
          %)
        </div>
      </section>

      <Pie
        total={totalSessions}
        ready={ready}
        complete={complete}
        available={available}
        free={free}
      />
    </section>
  );
};
