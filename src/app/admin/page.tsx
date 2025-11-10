import { Pie } from "@/components/admin/Chart";
import { Table } from "@/components/admin/Table";
import { Totals } from "@/components/admin/Totals";
import { User } from "@/components/admin/User";
import { getBookings } from "@/lib/bookings";
import { getSessions } from "@/lib/sessions";

import { TimeSlot, timeSlots } from "@/utils/timeSlots";
import { getUserOrRedirect } from "@propelauth/nextjs/server/app-router";

export default async function Admin() {
  const user = await getUserOrRedirect();
  if (!user) return null;

  const bookings = await getBookings();
  const sessions = await getSessions();

  return (
    <section className="space-y-8">
      <User />
      <Totals bookings={bookings} sessions={sessions} />

      {[
        TimeSlot.DAY_1_MORNING,
        TimeSlot.DAY_1_AFTERNOON,
        TimeSlot.DAY_1_EVENING,
        TimeSlot.DAY_2_MORNING,
        TimeSlot.DAY_2_AFTERNOON,
      ].map((item) => (
        <section key={item}>
          <b>{timeSlots[item].label}</b>
          <Totals
            bookings={bookings}
            sessions={sessions.filter(({ timeSlot }) => timeSlot === item)}
          />
          <Table
            bookings={bookings}
            sessions={sessions}
            currentTimeSlot={item}
          />
        </section>
      ))}
    </section>
  );
}
