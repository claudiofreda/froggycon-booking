import { PageTitle } from "@/components/PageTitle";
import { Booking } from "@/types";

export default async function PublicLayout({
  children,
}: Readonly<{
  params: { bookingId: Booking["id"] };
  children: React.ReactNode;
}>) {
  return (
    <>
      <PageTitle title="Prenota una sessione" />
      <p>
        Alla FroggyCon, ciascuna sessione inizia da uno scenario, preparato o generato al momento: un punto d&apos;inizio, senza fine premeditata.
        Vi siederete a un tavolo con gli altri partecipanti e il facilitatore. Ascoltatelo e aiutatelo quando potete: il suo ruolo è di insegnarvi a giocare.
        Liberatevi da tutte le aspettative riguardo a come dovrebbe andare la sessione. Sedetevi con interesse e apertura,
        pronti a scoprire un&apos;esperienza unica e originale che nessuno di voi potrà prevedere.
        Giocherete per circa tre ore, alla fine delle quali il gioco si interromperà a qualunque punto esso sia arrivato: non è garantito un finale, perché per noi
        <strong>il viaggio conta più della meta</strong>, e soprattutto che quel viaggio si svolga senza forzature.
      </p>
      {children}
    </>
  );
}
