import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Link,
} from "@react-email/components";
import { Adventure, Booking } from "@/types";

const baseUrl = process.env.BASE_URL;

interface ConfirmationEmailProps {
  subject: string;
  booking: Booking;
  adventure: Adventure;
}

export const ConfirmationEmail: React.FC<ConfirmationEmailProps> = ({
  subject,
  booking,
  adventure,
}) => {
  const { name, seats, id: bookingId } = booking;
  const { title, timeSlot } = adventure;

  const date = timeSlot > 2 ? "Domenica 23 Marzo 2025" : "Sabato 22 Marzo 2025";
  const time = timeSlot !== 2 ? "10:00–13:00" : "17:00–20:00";
  const mail = process.env.MAIL_CONTACT;

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.4" }}>
        <Container>
          <Heading>Ciao {name},</Heading>
          <Text>
            È ufficiale: hai {seats} post{seats === 1 ? "o" : "i"} prenotati per
            la sessione {title} alla FroggyCon III
          </Text>

          <Text style={{ fontSize: "16px", marginBottom: "20px" }}>
            I dettagli da sapere:
          </Text>
          <Text style={{ fontSize: "16px", lineHeight: "1.6" }}>
            - <strong>Avventura:</strong> {title}
            <br />- <strong>Data:</strong> {date}
            <br />- <strong>Presso:</strong>{" "}
            <Link href="https://maps.app.goo.gl/WUAuStwHQdpZ1XLt6">
              La Pieve di Cologno, Piazza S. Matteo, 24, Cologno Monzese MI
            </Link>
            <br />- <strong>Orario:</strong> {time}
            <br />- <strong>Numero di posti prenotati:</strong> {seats}
          </Text>

          <Text>
            Puoi gestire la tua prenotazione cliccando{" "}
            <Link href={`${baseUrl}/bookings/${bookingId}`}>qui</Link>.
          </Text>

          <Text>
            Quest&apos;anno avremo anche la possibilità di pranzare e cenare
            assieme sempre presso La Pieve di Cologno, lo stesso posto dove si
            svolgerà la convention. Se vuoi unirti a noi, riceverai a breve un'email
            con un modulo per prenotare i tuoi pasti.
          </Text>

          <Text>
            Per qualsiasi dubbio, domanda, o richiesta particolare sentiti
            liberə di contattarci a <Link href={`mailto:${mail}`}>{mail}</Link>.
          </Text>

          <Text>
            <Link href="https://froggycon.it">
              froggycon.it
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
