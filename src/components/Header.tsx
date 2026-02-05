import Link from "next/link";
import Image from "next/image";
import logo from "../public/logo.png";

export const Header = () => {
  return (
    <header className="flex flex-col items-center space-y-4 mb-4 w-full">
      <section className="flex flex-col items-center space-y-4">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo FroggyCon"
            style={{
              width: "auto",
              height: "100%",
            }}
            height={100}
          />
        </Link>
        <h2>
          <b>
            14 e 15 marzo 2026 @{" "}
            <a className="underline" href="https://www.progettolapieve.com/">
              Pieve di Cologno
            </a>{" "}
            (MI)
          </b>
        </h2>
      </section>

      <nav className="bg-base-200 rounded-md navbar">
        <ul className="flex justify-center space-x-2 font-bold menu menu-horizontal">
          <li>
            <Link href="https://www.froggycon.it/">Cos&apos;è FroggyCon</Link>
          </li>
          <li>
            <Link href="https://www.froggycon.it/dove-e-quando">
              Dove e quando?
            </Link>
          </li>
          <li>
            <Link href="https://www.froggycon.it/chi-siamo">Chi siamo</Link>
          </li>
          <li>
            <Link href="https://www.froggycon.it/i-nostri-principi">I nostri principi</Link>
          </li>
          <li>
            <Link href="https://www.froggycon.it/workshop">Programma workshop (14:00&ndash;16:00 sabato e domenica)</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
