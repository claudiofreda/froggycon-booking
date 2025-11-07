import { Booking, Session } from "@/types";

import { TimeSlot, timeSlots } from "@/utils/timeSlots";
import { useTranslations } from "next-intl";
import { CSSProperties, FC, Fragment } from "react";

type Field = {
  key: keyof Session;
  style: CSSProperties;
};

const DEFAULT_FIELDS: Field[] = [
  { key: "tableNumber", style: { width: "5%", textAlign: "center" } },
  { key: "title", style: { width: "25%" } },
  { key: "masterName", style: { width: "20%" } },
  { key: "ruleset", style: { width: "20%" } },
  { key: "maxPlayers", style: { width: "20%" } },
] as const;

const getClassNameForSession = (session: Session) => {
  const bookedSeats = session.maxPlayers - session.availableSeats;

  if (bookedSeats >= session.minPlayers) {
    return "bg-green-400 bg-opacity-20";
  }

  if (bookedSeats > 0 && bookedSeats < session.minPlayers) {
    return "bg-amber-400 bg-opacity-20";
  }

  return "bg-base-200";
};

export const Table: FC<{
  sessions: Session[];
  bookings: Booking[];
  currentTimeSlot: TimeSlot;
  fields?: Field[];
  prefix?: string;
}> = ({
  sessions,
  bookings,
  currentTimeSlot,
  fields = DEFAULT_FIELDS,
  prefix,
}) => {
  const t = useTranslations("Components.Table");

  const title = [prefix && `${prefix} - `, timeSlots[currentTimeSlot].label]
    .filter(Boolean)
    .join("");

  return (
    <table className="table min-w-[1000px]">
      <thead>
        <tr>
          <td colSpan={fields.length} className="text-center">
            {title}
          </td>
        </tr>
        <tr>
          {fields.map((field) => (
            <th key={field.key} style={field.style}>
              {t(field.key)}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {sessions
          .filter(({ timeSlot }) => timeSlot === currentTimeSlot)
          .map((session) => {
            const bookingsForSession = bookings
              .filter(({ sessionId }) => sessionId === session.id)
              .flatMap(({ name, seats }) =>
                Array.from(
                  { length: seats },
                  (_, index) =>
                    `${name}${seats > 1 ? `(${index + 1}/${seats})` : ""}`
                )
              );

            const bookingCols = fields.length - 1;
            const bookingRowsRaw = Array.from(
              { length: Math.ceil(bookingsForSession.length / bookingCols) },
              (_, rowIndex) =>
                bookingsForSession.slice(
                  rowIndex * bookingCols,
                  (rowIndex + 1) * bookingCols
                )
            );
            const bookingRows =
              bookingRowsRaw.length === 0 ? [[]] : bookingRowsRaw;

            const firstCellRowSpan = bookingRows.length + 1;
            return (
              <Fragment key={session.id}>
                <tr className={getClassNameForSession(session)}>
                  {fields.map((field, index) => (
                    <td
                      className="px-4"
                      key={field.key}
                      rowSpan={index === 0 ? firstCellRowSpan : 1}
                      style={field.style}
                    >
                      <span className="font-semibold">
                        {session[field.key]}
                      </span>
                    </td>
                  ))}
                </tr>

                {bookingRows.map((row, rowIndex) => (
                  <tr key={`${session.id}-booking-row-${rowIndex}`}>
                    {row.map((booking) => (
                      <td key={booking} className="px-4">
                        {booking}
                      </td>
                    ))}
                    {row.length < bookingCols &&
                      Array.from({ length: bookingCols - row.length }).map(
                        (_, i) => (
                          <td
                            key={`empty-${session.id}-${rowIndex}-${i}`}
                            className="px-4"
                          >
                            &nbsp;
                          </td>
                        )
                      )}
                  </tr>
                ))}
              </Fragment>
            );
          })}
      </tbody>
    </table>
  );
};
