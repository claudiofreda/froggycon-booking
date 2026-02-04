export enum TimeSlot {
  DAY_1_MORNING = 1,
  DAY_1_AFTERNOON = 2,
  DAY_1_EVENING = 3,

  DAY_2_MORNING = 4,
  DAY_2_AFTERNOON = 5,
}

type TimeSlotDetails = {
  label: string;
  className: string;
  date: string;
  day: string;
  time: string;
};

export const timeSlots: Record<TimeSlot, TimeSlotDetails> = {
  1: {
    label: "Sabato 10.00 - 13.00",
    date: "Sabato 22 Novembre 2025",
    day: "Sabato",
    time: "10.00 - 13.00",
    className: "timeslot-pink-500",
  },
  2: {
    label: "Sabato 14.00 - 17.00",
    date: "Sabato 22 Novembre 2025",
    day: "Sabato",
    time: "14.00 - 17.00",
    className: "timeslot-fuchsia-500",
  },
  3: {
    label: "Sabato 17.30 - 20.30",
    date: "Sabato 22 Novembre 2025",
    day: "Sabato",
    time: "17.30 - 20.30",
    className: "timeslot-rose-500",
  },
  4: {
    label: "Domenica 10.00 - 14.00",
    date: "Domenica 23 Novembre 2025",
    day: "Domenica",
    time: "10.00 - 14.00",
    className: "timeslot-indigo-500",
  },
  5: {
    label: "Domenica 16.00 - 20.00",
    date: "Domenica 23 Novembre 2025",
    day: "Domenica",
    time: "16.00 - 20.00",
    className: "timeslot-teal-500",
  },
} as const satisfies Record<TimeSlot, TimeSlotDetails>;
