import { Booking } from "@/types";

export type BookingFormInputs = Omit<Booking, "id"> & {
  id?: Booking["id"];
  emailConfirmation?: string;
};
