import { TimeSlot } from "@/utils/timeSlots";

export type Session = {
  id: string;
  timeSlot: TimeSlot;
  tableNumber: number;
  title: string;
  ruleset: string;
  masterName: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  availableSeats: number;
  age: string;
  kids: boolean;
  isPanel: boolean;
};
