"use client";

import { Booking } from "@/types";
import dynamic from "next/dynamic";
import { FC, useState } from "react";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BookingLineProps {
  bookings: Booking[];
}

export const BookingLine: FC<BookingLineProps> = ({ bookings }) => {
  const bookingsByDay = bookings
    .filter(({ timeStamp }) => timeStamp && timeStamp !== "timestamp")
    .reduce((acc, booking) => {
      const date = new Date(booking.timeStamp);
      console.log(date, booking.timeStamp);
      const dayKey = date.toISOString().split("T")[0];
      acc[dayKey] = (acc[dayKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const days = Object.keys(bookingsByDay).sort();

  const bookingsPerDay = days.map((day) => bookingsByDay[day]);

  const cumulativeTotal = bookingsPerDay.reduce((acc, count, index) => {
    const total = index === 0 ? count : acc[index - 1] + count;
    acc.push(total);
    return acc;
  }, [] as number[]);

  const series = [
    {
      name: "Prenotazioni",
      type: "column",
      data: bookingsPerDay,
    },
    {
      name: "Totale Cumulativo",
      type: "line",
      data: cumulativeTotal,
    },
  ];

  const options = {
    chart: {
      height: 700,
      type: "line" as const,
      dropShadow: {
        enabled: false,
      },
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#77B6EA", "#FF6B6B"],
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1],
    },
    stroke: {
      curve: "smooth" as const,
      width: [0, 3],
    },
    title: {
      text: "Prenotazioni per Giorno",
      align: "left" as const,
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    markers: {
      size: [0, 4],
    },
    xaxis: {
      categories: days,
      title: {
        text: "Data",
      },
    },
    yaxis: {
      title: {
        text: "Numero Prenotazioni",
      },
      min: 0,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
    } as const,
  };

  const [show, setShow] = useState(true);

  return (
    <section>
      <button
        className="flex-1 mb-4 btn btn-secondary"
        onClick={() => {
          setShow(!show);
        }}
      >
        {show ? "Nascondi" : "Mostra"} Andamento Prenotazioni
      </button>

      {show && (
        <ApexChart series={series} options={options} height={350} width={800} />
      )}
    </section>
  );
};
