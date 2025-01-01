import { Header } from "@/components/Header";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prenotazioni | FroggyCon III",
  description: "Prenotazioni per FroggyCon III",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="p-4 antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
