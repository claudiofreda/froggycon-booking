export type Adventure = {
  id: string;
  timeSlot: 1 | 2 | 3;
  tableNumber: number;
  title: string;
  ruleset: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  masterName: string;
  availableSeats: number;
  age: string;
};
