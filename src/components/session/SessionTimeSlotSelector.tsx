import { TimeSlot, timeSlots } from "@/utils/timeSlots";
import { useTranslations } from "next-intl";
import { FC, useMemo } from "react";

type SessionTimeSlotSelectorProps = {
  selectTimeSlots: (timeSlot: TimeSlot[]) => void;
  selectedTimeSlots: TimeSlot[];
  exclude?: TimeSlot[];
};

const saturdayTimeSlots = [
  TimeSlot.DAY_1_MORNING,
  TimeSlot.DAY_1_AFTERNOON,
  TimeSlot.DAY_1_EVENING,
];

const sundayTimeSlots = [TimeSlot.DAY_2_MORNING, TimeSlot.DAY_2_AFTERNOON];

export const SessionTimeSlotSelector: FC<SessionTimeSlotSelectorProps> = ({
  selectTimeSlots,
  selectedTimeSlots,
  exclude,
}) => {
  const t = useTranslations("Components.SessionTimeSlotSelector");

  const TimeSlotsRow: FC<{
    displayedTimeSlots: TimeSlot[];
  }> = ({ displayedTimeSlots }) => {
    return (
      <section className="flex flex-row flex-wrap -m-2 mt-2 first:mt-0">
        {displayedTimeSlots
          .map((timeSlot) => ({
            timeSlot: Number(timeSlot) as TimeSlot,
            details: timeSlots[timeSlot],
          }))
          .filter(({ timeSlot }) => {
            if (!exclude) return true;

            if (exclude.includes(timeSlot)) return false;
            return true;
          })
          .map(({ timeSlot, details }) => (
            <button
              key={timeSlot}
              onClick={() => selectTimeSlots([timeSlot])}
              className={`m-2 flex-1 md:flex-initial btn btn-timeslot block md:flex p-0 md:px-4 ${
                details.className
              } ${
                !selectTimeSlots.length || selectedTimeSlots.includes(timeSlot)
                  ? ""
                  : "btn-timeslot-outline"
              }`}
            >
              <span>{details.day}</span>{" "}
              <span className="block">{details.time}</span>
            </button>
          ))}
      </section>
    );
  };

  const isSaturdaySelected = useMemo(
    () =>
      saturdayTimeSlots.every((timeSlot) =>
        selectedTimeSlots.includes(timeSlot)
      ),
    [selectedTimeSlots]
  );

  const isSundaySelected = useMemo(
    () =>
      sundayTimeSlots.every((timeSlot) => selectedTimeSlots.includes(timeSlot)),
    [selectedTimeSlots]
  );

  return (
    <>
      <section className="flex md:flex-row flex-col flex-wrap -m-2">
        <button
          onClick={() => selectTimeSlots([])}
          className={`m-2 btn ${
            !selectedTimeSlots?.length ? "" : "btn-outline"
          }`}
        >
          {t("allTimeSlots")}
        </button>

        <section className="flex">
          <button
            onClick={() => selectTimeSlots(saturdayTimeSlots)}
            className={`m-2 flex-1 md:flex-initial btn btn-secondary block md:flex ${
              isSaturdaySelected ? "" : "btn-outline"
            }`}
          >
            <span>Sabato</span> <span className="block">22 Novembre</span>
          </button>

          <button
            onClick={() => selectTimeSlots(sundayTimeSlots)}
            className={`m-2 flex-1 btn btn-accent block md:flex ${
              isSundaySelected ? "" : "btn-outline"
            }`}
          >
            <span>Domenica</span> <span className="block">23 Novembre</span>
          </button>
        </section>
      </section>

      <TimeSlotsRow displayedTimeSlots={saturdayTimeSlots} />

      <TimeSlotsRow displayedTimeSlots={sundayTimeSlots} />
    </>
  );
};
