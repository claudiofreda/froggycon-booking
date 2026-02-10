import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

export const ErrorToast = ({ error }: { error: boolean }) => {
  const [showError, setShowError] = useState(false);

  const t = useTranslations("Components.ErrorToast");

  useEffect(() => {
    if (error) {
      setShowError(true);

      const timer = setTimeout(() => setShowError(false), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
      {showError && (
        <div className="toast" onClick={() => setShowError(false)}>
          <div className="alert alert-error">
            <span>{t("body")}</span>
          </div>
        </div>
      )}
    </>
  );
};
