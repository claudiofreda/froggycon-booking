import AnimatedEllipsis from "@/components/AnimatedEllipsis";
import { useTranslations } from "next-intl";

export const Loader = ({ text }: { text?: string }) => {
  const t = useTranslations("Components");

  return (
    <div className="top-0 left-0 z-50 fixed inset-0 flex flex-col justify-center items-center bg-neutral bg-opacity-30 m-0 min-h-full">
      <div className="loading loading-lg loading-spinner" />
      <div className="mt-4">
        {text || t("loading")}
        <AnimatedEllipsis />
      </div>
    </div>
  );
};
