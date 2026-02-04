"use client";

import { ErrorToast } from "@/components/ErrorToast";
import { Loader } from "@/components/Loader";
import { useSessions } from "@/hooks/useSessions";
import { useBookingForm } from "@/hooks/useBookingForm";
import { Booking } from "@/types";
import { redirect } from "next/navigation";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export const BookingDeleteButton = ({
  bookingId,
}: {
  bookingId: Booking["id"];
}) => {
  const [confirmationModalOpen, setConfirmationModalOpen] =
    useState<boolean>(false);

  const { loading, result, error, deleteBooking } = useBookingForm();
  const { invalidateCache: invalidateSessionCache } = useSessions();

  const t = useTranslations("Components.BookingDeleteButton");

  useEffect(() => {
    if (result) redirect("/");
  }, [result]);

  useEffect(() => {
    setConfirmationModalOpen(false);
  }, [error]);

  return (
    <>
      <button
        type="button"
        className="w-full btn btn-error"
        onClick={() => setConfirmationModalOpen(true)}
      >
        {t("deleteBooking")}
      </button>

      {loading && <Loader />}

      <ErrorToast error={Boolean(error)} />

      {bookingId && confirmationModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <button
              className="top-2 right-2 absolute btn btn-circle btn-ghost btn-sm"
              onClick={() => setConfirmationModalOpen(false)}
            >
              ✕
            </button>

            <h3 className="font-bold text-lg">{t("modal.title")}</h3>
            <p className="py-4">{t("modal.body")}</p>
            <div className="flex space-x-4 w-full">
              <button
                className="flex-1 btn btn-error"
                onClick={() => {
                  deleteBooking(bookingId);
                  setConfirmationModalOpen(false);
                  invalidateSessionCache();
                }}
              >
                {t("modal.yes")}
              </button>
              <button
                className="flex-1 btn"
                onClick={() => setConfirmationModalOpen(false)}
              >
                {t("modal.no")}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};
