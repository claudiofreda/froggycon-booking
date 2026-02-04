import { getSessions } from "@/lib/sessions";
import {
  addBooking,
  deleteBooking,
  getBookingById,
  updateBooking,
} from "@/lib/bookings";
import { sendConfirmationEmail } from "@/lib/email";
import { Session, Booking, BookingFormInputs } from "@/types";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

function getAvailabilityError(
  availableSeats: Session["availableSeats"]
): Session["id"] {
  if (availableSeats === 0) return "Nessun posto disponibile";
  if (availableSeats === 1) return "Solo un posto disponibile";
  return `Solo ${availableSeats} posti disponibili`;
}

async function validateBookingData({
  sessionId,
  seats,
  addSeats = 0,
}: {
  sessionId: Session["id"];
  seats: Booking["seats"];
  addSeats: Booking["seats"];
}) {
  const sessions = await getSessions();
  const foundSession = sessions.find((a) => a.id === sessionId);

  const availabileSeats = (foundSession?.availableSeats || 0) + addSeats;

  if (!foundSession) {
    return { error: "Avventura non trovata", status: 400 };
  }

  if (seats > availabileSeats) {
    const availabilityError = getAvailabilityError(availabileSeats);
    return { error: availabilityError, status: 400 };
  }

  return { session: foundSession, error: null };
}

async function handleBookingRequest(
  input: BookingFormInputs,
  processBooking: (params: {
    booking: Booking;
    session: Session;
  }) => Promise<void>
) {
  // adds a random UUID when creating the booking, keeps the current id otherwise
  const booking: Booking = { ...input, id: input.id || randomUUID() };

  try {
    const { session, error, status } = await validateBookingData({
      sessionId: booking.sessionId,
      seats: Number(booking.seats),
      addSeats: Number(
        input.id && booking.sessionId === input.sessionId ? booking.seats : 0
      ),
    });

    if (error || !session) {
      return NextResponse.json({ error }, { status });
    }

    await processBooking({
      booking,
      session,
    });

    return NextResponse.json({
      ...booking,
    });
  } catch (error) {
    console.error("Errore durante l'operazione:", error);
    return NextResponse.json(
      { error: "Errore durante l'operazione" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const input = await request.json();

  return handleBookingRequest(input, async ({ booking, session }) => {
    await addBooking(booking);
    await sendConfirmationEmail({ booking, session });
  });
}

export async function PATCH(request: Request) {
  const input = await request.json();

  return handleBookingRequest(input, async ({ booking, session }) => {
    await updateBooking(booking);
    const oldBooking = await getBookingById(booking.id);
    if (!oldBooking) return;

    await sendConfirmationEmail({
      booking: { ...booking, email: oldBooking.email },
      session,
      update: true,
    });
  });
}

export async function DELETE(request: Request) {
  const { id } = (await request.json()) as Booking;

  try {
    await deleteBooking(id);

    return NextResponse.json({
      message: "Prenotazione cancellata con successo!",
      id,
    });
  } catch (error) {
    console.error("Errore durante la cancellazione della prenotazione:", error);
    return NextResponse.json(
      { error: "Errore durante la cancellazione della prenotazione" },
      { status: 500 }
    );
  }
}
