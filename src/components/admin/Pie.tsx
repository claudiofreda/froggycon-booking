"use client";

import dynamic from "next/dynamic";
import { FC, useState } from "react";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PieProps {
  complete: number;
  ready: number;
  available: number;
  free: number;
  total: number;
}

export const Pie: FC<PieProps> = ({ complete, ready, available, free }) => {
  const options = {
    labels: [
      "Al completo",
      "Pronte a partire",
      "Posti disponibili",
      "Nessuna prenotazione",
    ],
    colors: ["#05df72", "#7bf1a8", "#fff085", "#99a1af"],
  };

  const series = [complete, ready, available, free];

  const [show, setShow] = useState(false);

  return (
    <section>
      <button
        className="flex-1 btn btn-accent"
        onClick={() => {
          setShow(!show);
        }}
      >
        {show ? "Nascondi" : "Mostra"} Grafico
      </button>

      {show && (
        <ApexChart
          type="pie"
          options={options}
          series={series}
          height={200}
          width={500}
        />
      )}
    </section>
  );
};
