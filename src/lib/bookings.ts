import {
  appendDataToSheet,
  deleteRowById,
  getSheetData,
  updateRowById,
} from "@/lib/sheets";
import { Booking } from "@/types";
import config from "@/utils/config";

const spreadsheetId = config.bookingsSheetId;
const range = config.bookingsRange;

type BookingRow = [
  Booking["timeStamp"],
  Booking["id"],
  Booking["name"],
  Booking["email"],
  Booking["seats"],
  Booking["sessionId"]
];

export async function getBookings(): Promise<Booking[]> {
  const bookingsResponse = await getSheetData({
    spreadsheetId,
    range,
  });

  const bookingsRows = bookingsResponse ? bookingsResponse : [];

  const bookings = bookingsRows.map((row) => {
    const [timeStamp, id, name, email, seats, sessionId] = row as [
      string,
      ...BookingRow
    ];

    return {
      timeStamp,
      id,
      name,
      email,
      seats: Number(seats),
      sessionId: String(sessionId),
    };
  });

  return bookings;
}

export async function getBookingById(
  id: Booking["id"]
): Promise<Booking | null> {
  const data = await getBookings();

  const booking = data.find((booking) => booking.id === id);

  if (!booking) {
    return null;
  }

  return booking;
}

export async function addBooking({
  id,
  name,
  email,
  seats,
  sessionId,
}: Booking) {
  await appendDataToSheet({
    spreadsheetId,
    range,
    data: [id, name, email, seats, sessionId],
  });
}

export async function updateBooking({
  id,
  name,
  seats,
  sessionId,
}: Omit<Booking, "email">) {
  const newData = [id, name, undefined, seats, sessionId];

  return updateRowById({
    spreadsheetId,
    range,
    id,
    newData,
  });
}

export async function deleteBooking(id: Booking["id"]) {
  return deleteRowById({
    spreadsheetId,
    range,
    id,
  });
}
