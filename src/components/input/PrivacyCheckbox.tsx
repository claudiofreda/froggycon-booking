import React, { MouseEventHandler, ReactElement, useState } from "react";
import { useTranslations } from "use-intl";

interface PrivacyCheckboxProps {
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
  termsAndConditions: ReactElement;
}

export const PrivacyCheckbox: React.FC<PrivacyCheckboxProps> = ({
  isChecked,
  setIsChecked,
  termsAndConditions,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const t = useTranslations("Components.PrivacyCheckbox");

  return (
    <div className="flex items-center">
      <label className="justify-start cursor-pointer label">
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          checked={isChecked}
          onChange={(event) => setIsChecked(event.target.checked)}
        />
        <span className="ml-2 label-text">
          {t.rich("readAndAccept", {
            termsAndConditions: (chunks) => (
              <a
                onClick={openModal}
                className="underline cursor-pointer label-text"
              >
                {chunks}
              </a>
            ),
          })}
        </span>
      </label>

      {isModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <div className="markdown">{termsAndConditions}</div>

            <div className="flex justify-center space-x-4 w-full">
              <button className="flex-1 btn" onClick={closeModal}>
                {t("closeModal")}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};
