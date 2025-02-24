"use client";

import { Adventure } from "@/types";
import { Fragment } from "react";

interface AdventureCardProps extends Adventure {
  expanded?: boolean;
  selectable?: boolean;
  onSelect?: (id: Adventure["id"]) => void;
}

export const AdventureCard: React.FC<AdventureCardProps> = ({
  id,
  tableNumber,
  title,
  ruleset,
  description,
  minPlayers,
  maxPlayers,
  timeSlot,
  masterName,
  age,
  availableSeats,

  expanded = false,
  selectable = false,
  onSelect = () => {},
}) => {
  const useMinPlayers = process.env.NEXT_PUBLIC_USE_MIN_PLAYERS;

  return (
    <article
      className={
        selectable
          ? "h-full card bg-base-200 shadow-xl cursor-pointer opacity-80 hover:opacity-100"
          : "h-full"
      }
      onClick={() => selectable && onSelect(id)}
    >
      <div className={selectable ? "card-body" : "space-y-2"}>
        <div className="flex-col space-y-2">
          <div className="flex flex-row justify-between items-center">
            <div
              className={`font-bold p-2 badge ${
                timeSlot === 1 ? "badge-primary" : timeSlot === 2 ? "badge-accent" : "badge-secondary"
              }`}
            >
              {timeSlot === 1 ? "Sabato 22 Marzo ’25, 10:00–13:00" : timeSlot === 2 ? "Sabato 22 Marzo ’25, 17:00–20:00" : "Domenica 23 Marzo ’25, 10:00–13:00"}
            </div>

            {age && <div className="p-2.5 badge badge-outline">Età: {age}</div>}
          </div>

          <h2 className="flex-1 card-title">
            ({tableNumber}) {title}
          </h2>
        </div>

        <p>
          <span className="italic">{ruleset}</span>,{" "}
          <>
            per {useMinPlayers ? `almeno ${minPlayers}` : maxPlayers}{" "}
            partecipanti
          </>
        </p>
        <p className="max-w-3xl">
          {(expanded ? description : `${description.slice(0, 200).trim()}...`)
            .split("\n")
            .map((text, key) => (
              <Fragment key={key}>
                {text}
                <br />
              </Fragment>
            ))}
        </p>
        <div className="flex space-x-2">
          <p>
            <strong>Facilitata da:</strong> {masterName}
          </p>
          <p></p>
        </div>
        <p>
          <strong>Posti disponibili:</strong> {availableSeats}
        </p>
      </div>
    </article>
  );
};
