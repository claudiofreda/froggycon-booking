"use client";

import { ErrorToast } from "@/components/ErrorToast";
import { Loader } from "@/components/Loader";
import { useBookingForm } from "@/hooks/useBookingForm";
import { BookingFormInputs, Session } from "@/types";
import { anonymizeEmail } from "@/utils/anonymizeEmail";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Input, Label, PrivacyCheckbox } from "@/components/input";
import { useSessions } from "@/hooks/useSessions";
import { useTranslations } from "next-intl";

type BookingFormProps = {
  defaultBooking?: BookingFormInputs;
  selectedSession: Session;
  termsAndConditions: JSX.Element;
};

export const BookingForm: React.FC<BookingFormProps> = ({
  defaultBooking,
  selectedSession,
  termsAndConditions,
}) => {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BookingFormInputs>({
    defaultValues: defaultBooking,
    mode: "onChange",
  });

  const { availableSeats, maxPlayers, id: sessionId } = selectedSession;

  const { invalidateCache: invalidateSessionCache } = useSessions();

  const bookableSeats = (() => {
    if (defaultBooking && defaultBooking.sessionId === sessionId) {
      return Math.min(availableSeats + defaultBooking.seats, maxPlayers);
    }

    return availableSeats;
  })();

  const { createBooking, updateBooking, loading, result, error } =
    useBookingForm();

  const onSubmit = (data: BookingFormInputs) => {
    if (defaultBooking && defaultBooking.id) {
      updateBooking(defaultBooking.id, { ...data, sessionId });
    } else {
      createBooking({ ...data, sessionId });
    }

    invalidateSessionCache();
  };

  const [privacyCheckbox, setPrivacyCheckbox] = useState(false);

  const editMode = Boolean(defaultBooking?.email);

  const t = useTranslations("Components.BookingForm");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto">
      <section className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name" text={t("name")} />
          <Input
            id="name"
            type="text"
            register={register}
            error={errors.name?.message}
            validationRules={{ required: t("required.name") }}
          />
        </div>

        {defaultBooking?.email && (
          <div>
            <Label htmlFor="email" text={t("emailPicked")} />
            <Input
              id="email"
              type="email"
              disabled
              value={anonymizeEmail(defaultBooking.email)}
            />
          </div>
        )}

        {!editMode && (
          <>
            {/* Email */}
            <div>
              <Label htmlFor="email" text={t("email")} />
              <Input
                id="email"
                type="email"
                register={register}
                error={errors.email?.message}
                validationRules={{
                  required: t("required.email"),
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: t("emailInvalid"),
                  },
                }}
              />
            </div>

            <div>
              <Label
                htmlFor="emailConfirmation"
                text={t("emailConfirmation")}
              />
              <Input
                id="emailConfirmation"
                type="email"
                register={register}
                error={errors.emailConfirmation?.message}
                validationRules={{
                  required: t("required.emailConfirmation"),
                  validate: (value: string) =>
                    value === watch("email") || t("emailMismatch"),
                }}
              />
            </div>
          </>
        )}

        {/* Number of seats */}
        <div>
          <Label htmlFor="seats" text={t("seats", { bookableSeats })} />
          <Input
            id="seats"
            type="number"
            register={register}
            error={errors.seats?.message}
            validationRules={{
              required: t("required.seats"),
              min: { value: 1, message: t("seatsAtLeastOne") },
              max: {
                value: bookableSeats,
                message: t("seatsTooMany"),
              },
            }}
          />
        </div>

        <div>
          <PrivacyCheckbox
            isChecked={privacyCheckbox}
            setIsChecked={setPrivacyCheckbox}
            termsAndConditions={termsAndConditions}
          />
        </div>
      </section>

      {/* Submit button */}
      <button
        type="submit"
        className={`${
          !privacyCheckbox || !isValid ? " btn-disabled" : " btn-primary"
        } p-2 btn w-full mt-4`}
        disabled={!privacyCheckbox || !isValid}
      >
        {editMode ? t("edit") : t("submit")}
      </button>

      {loading && <Loader />}

      <ErrorToast error={Boolean(error)} />

      {result && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {editMode ? t("editSubmitted") : t("submitted")}
            </h3>
            <p className="py-4">{t("confirmationSent")}</p>
            <div className="flex justify-center space-x-4 w-full">
              <Link href="/">
                <button className="flex-1 btn">{t("confirm")}</button>
              </Link>
            </div>
          </div>
        </dialog>
      )}
    </form>
  );
};
