import { Session } from "@/types";
import { useEffect, useState } from "react";

export function useFilteredSessions(
  sessions?: Session[],
  timeSlots?: Session["timeSlot"][],
  search?: string
) {
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (!sessions) return;

    const filterByTimeSlot = (sessionTimeSlot: Session["timeSlot"]) =>
      !timeSlots || !timeSlots.length || timeSlots.includes(sessionTimeSlot);

    const filterBySearch = ({
      title,
      description,
      ruleset,
      masterName,
      age,
      isPanel,
      kids,
    }: Pick<
      Session,
      | "title"
      | "description"
      | "ruleset"
      | "masterName"
      | "age"
      | "isPanel"
      | "kids"
    >) =>
      !search ||
      [
        title,
        description,
        ruleset,
        masterName,
        age,
        isPanel ? "panel" : "",
        kids ? "kids" : "",
      ].some((string) => string?.toLowerCase().includes(search.toLowerCase()));

    const filtered = sessions.filter(
      ({
        timeSlot: sessionTimeSlot,
        title,
        ruleset,
        description,
        masterName,
        age,
        isPanel,
        kids,
      }) =>
        filterByTimeSlot(sessionTimeSlot) &&
        filterBySearch({
          title,
          description,
          ruleset,
          masterName,
          age,
          isPanel,
          kids,
        })
    );

    setFilteredSessions(filtered);
  }, [timeSlots, search, sessions]);

  return filteredSessions;
}
