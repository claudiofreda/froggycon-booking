import { Booking, Session } from "@/types";
import { TimeSlot } from "@/utils/timeSlots";
import { useTranslations } from "next-intl";
import { FC } from "react";

export const Totals: FC<{ bookings: Booking[]; sessions: Session[] }> = ({
  bookings,
  sessions,
}) => {
  const t = useTranslations("Components.Totals");

  const calculateTotal = (timeSlots: TimeSlot[]) => {
    const filteredSessions = sessions
      .filter(({ isPanel }) => !isPanel)
      .filter(({ timeSlot }) => timeSlots.includes(timeSlot));

    const totalSeats = filteredSessions.reduce(
      (total, { maxPlayers }) => total + (maxPlayers || 0),
      0
    );

    const bookedSeats = bookings
      .filter(({ sessionId }) =>
        filteredSessions.map(({ id }) => id).includes(sessionId)
      )
      .reduce((total, { seats }) => total + (seats || 0), 0);

    const totalPercentage = totalSeats
      ? ((bookedSeats / totalSeats) * 100).toFixed(2)
      : "0.00";

    const ready = filteredSessions.filter(({ id, minPlayers }) => {
      const sessionBookings = bookings
        .filter(({ sessionId }) => sessionId === id)
        .reduce((total, { seats }) => total + (seats || 0), 0);
      return sessionBookings >= (minPlayers || 3);
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
      totalSessions,
      readyPercentage,
    };
  };

  const renderTotal = (label: string, timeSlots: TimeSlot[]) => {
    const {
      bookedSeats,
      totalSeats,
      totalPercentage,
      ready,
      totalSessions,
      readyPercentage,
    } = calculateTotal(timeSlots);
    return (
      <section>
        <div>
          <b>{label}:</b> {bookedSeats}/{totalSeats} ({totalPercentage}%)
        </div>
        <div>
          {t("readyToStart")}: {ready}/{totalSessions} ({readyPercentage}
          %)
        </div>
      </section>
    );
  };

  const allTimeSlots = Object.values(TimeSlot).filter(
    (value): value is TimeSlot => Object.values(TimeSlot).includes(value)
  );

  return (
    <section className="space-y-4">
      {renderTotal("Totale prenotazioni", allTimeSlots)}
    </section>
  );
};
