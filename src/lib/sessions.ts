import { getBookings } from "@/lib/bookings";
import { getSheetData } from "@/lib/sheets";
import { Session } from "@/types";
import config from "@/utils/config";
import { timeSlots } from "@/utils/timeSlots";

const spreadsheetId = config.sessionsSheetId;
const sessionRange = config.sessionsRange;

type SessionRow = [
  Session["id"],
  Session["timeSlot"],
  Session["tableNumber"],
  Session["title"],
  Session["ruleset"],
  Session["masterName"],
  Session["description"],
  Session["minPlayers"],
  Session["maxPlayers"],
  Session["age"],
  Session["kids"],
  Session["isPanel"]
];

export const getSessions = async (): Promise<Session[]> => {
  const sessionsResponse = await getSheetData({
    spreadsheetId,
    range: sessionRange,
  });

  if (!sessionsResponse || sessionsResponse.length === 0) {
    throw new Error("No data found");
  }

  const bookings = await getBookings();

  const sessions: Session[] = sessionsResponse
    .slice(1)
    .map((row) => {
      const [
        id,
        timeSlot,
        tableNumber,
        title,
        ruleset,
        masterName,
        description,
        minPlayers,
        maxPlayers,
        age,
        isPanel,
      ] = row as SessionRow;

      if (!id) return;
      if (!Object.keys(timeSlots).includes(String(timeSlot))) return;

      const kids = age === "TPKids";

      const booked = bookings
        .filter(({ sessionId }) => sessionId === id)
        .reduce((total, { seats }) => total + seats, 0);

      const availableSeats = Math.max(0, maxPlayers - booked);

      return {
        id: id.replace(/\s+/g, ""), // sanification, removes all whitespace from ids
        timeSlot: Number(timeSlot) as Session["timeSlot"],
        tableNumber: Number(tableNumber),
        title,
        ruleset,
        description,
        minPlayers: Number(minPlayers),
        maxPlayers: Number(maxPlayers),
        masterName,
        availableSeats,
        age,
        kids,
        isPanel: String(isPanel) === "TRUE",
      };
    })
    .filter((item) => item !== undefined)
    .sort((a, b) => {
      if (a.timeSlot !== b.timeSlot) {
        return a.timeSlot - b.timeSlot;
      }

      if (a.tableNumber !== b.tableNumber) {
        return a.tableNumber - b.tableNumber;
      }

      return a.title.localeCompare(b.title);
    });

  return sessions;
};

export async function getSessionById(
  id: Session["id"]
): Promise<Session | null> {
  const data = await getSessions();

  const session = data.find((session) => session.id === id);

  if (!session) {
    return null;
  }

  return session;
}
