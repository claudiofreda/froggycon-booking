import { Booking, BookingFormInputs } from "@/types";
import { useState } from "react";

export const useBookingForm = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<
    Booking | { deleted: Booking["id"] } | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (bookingData: BookingFormInputs) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { name, email, seats, sessionId } = bookingData;

      const requiredFieldMissing =
        [name, email, seats, sessionId].filter(Boolean).length === 0;

      if (requiredFieldMissing) {
        throw new Error("Required field missing. Could not create booking.");
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, seats, sessionId }),
      });

      if (!response.ok) {
        throw new Error("Could not create booking.");
      }

      const result = await response.json();
      setResult(result);
    } catch (error) {
      setError((error as Error).message || "Could not create booking.");
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (
    id: Booking["id"],
    bookingData: BookingFormInputs
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { name, seats, sessionId } = bookingData;

      const requiredFieldMissing =
        [name, seats, sessionId].filter(Boolean).length === 0;

      if (requiredFieldMissing) {
        throw new Error("Required field missing. Could not update booking.");
      }

      const response = await fetch(`/api/bookings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name, seats, sessionId }),
      });

      if (!response.ok) {
        throw new Error("Could not update booking.");
      }

      const result = await response.json();
      setResult(result);
    } catch (error) {
      setError((error as Error).message || "Could not update booking.");
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id: Booking["id"]) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/bookings`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Could not delete booking.");
      }

      await response.json();
      setResult({ deleted: id });
    } catch (error) {
      setError((error as Error).message || "Could not delete booking.");
    } finally {
      setLoading(false);
    }
  };

  return {
    createBooking,
    updateBooking,
    deleteBooking,

    loading,
    result,
    error,
  };
};
