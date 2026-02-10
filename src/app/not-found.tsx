import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound({
  description,
  ctaLabel,
}: {
  description?: string;
  ctaLabel?: string;
}) {
  const t = useTranslations("NotFound");

  return (
    <section className="flex flex-col justify-center items-center my-4 min-h-full text-center">
      <h2 className="mt-4 font-semibold text-secondary text-3xl">
        {t("title")}
      </h2>
      <p className="mt-4 text-neutral text-lg">
        {description || t("description")}
      </p>
      <Link href="/" className="mt-6 btn btn-primary">
        {ctaLabel || t("ctaLabel")}
      </Link>
    </section>
  );
}
