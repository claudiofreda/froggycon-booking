"use client";

import { AdventureCard } from "@/components/AdventureCard";
import { Loader } from "@/components/Loader";
import { useAdventures } from "@/hooks/useAdventures";
import { useFilteredAdventures } from "@/hooks/useFilteredAdventures";
import { Adventure } from "@/types";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useState } from "react";

export const AdventureSelector: React.FC<{
  baseUrl?: string;
}> = ({ baseUrl = "/adventure" }) => {
  const [timeSlot, setTimeSlot] = useState<Adventure["timeSlot"]>();
  const [search, setSearch] = useState<string>("");

  const { data: adventures, loading, error } = useAdventures();

  const filtered = useFilteredAdventures(adventures, timeSlot, search);

  if (loading) return <Loader />;

  if (!adventures || error)
    return <p>Qualcosa è andato storto, prova a ricaricare la pagina</p>;

  return (
    <>
      <section className="flex md:flex-row flex-col md:justify-between space-y-4 md:space-y-0 my-4">
        <section className="flex md:flex-row flex-col md:space-x-2 space-y-4 md:space-y-0">
          <button
            onClick={() => setTimeSlot(undefined)}
            className={`btn ${!timeSlot ? "" : "btn-outline"}`}
          >
            Tutte le fasce orarie
          </button>

          <button
            onClick={() => setTimeSlot(1)}
            className={`btn btn-primary ${timeSlot === 1 ? "" : "btn-outline"}`}
          >
            Sabato 22 Marzo ’25, 10:00–13:00
          </button>

          <button
            onClick={() => setTimeSlot(2)}
            className={`btn btn-accent ${timeSlot === 2 ? "" : "btn-outline"}`}
          >
            Sabato 22 Marzo ’25, 17:00–20:00
          </button>

          <button
            onClick={() => setTimeSlot(3)}
            className={`btn btn-secondary ${timeSlot === 3 ? "" : "btn-outline"}`}
          >
            Domenica 23 Marzo ’25, 10:00–13:00
          </button>
        </section>

        <label className="flex items-center gap-2 input-bordered input">
          <input
            type="text"
            placeholder="Cerca una sessione"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full"
          />
          {
            <button
              className={`m-0 p-0 w-6 h-6 min-h-0 btn btn-circle ${
                search
                  ? "opacity-1 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <XMarkIcon className="w-4 h-4" onClick={() => setSearch("")} />
            </button>
          }

          <MagnifyingGlassIcon className="w-6 h-6 text-neutral-400" />
        </label>
      </section>

      <section className="gap-8 grid grid-cols-1 md:grid-cols-2">
        {filtered.map((adventure: Adventure) => (
          <Link key={adventure.id} href={`${baseUrl}/${adventure.id}`}>
            <AdventureCard {...adventure} selectable />
          </Link>
        ))}
      </section>
    </>
  );
};
