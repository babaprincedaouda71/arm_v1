import * as React from "react";
import { KEY_CODES } from "../../constants/commonConst";
// import useTranslation from "next-translate/useTranslation";

const Modal = ({
  open,
  title,
  children,
  bodyClass = "",
  onClose,
  onEsc,
  size = "medium",
}: Modal) => {
  if (!open) return null;
  // const { t } = useTranslation("common");

  const handleEscEvent = (e: KeyboardEvent) => {
    if (open) if (e.keyCode === KEY_CODES.esc) onEsc?.();
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const getBodyClasses = () => {
    let classes = `modal-container bg-white w-11/12 mx-auto rounded-xl shadow-lg z-50 overflow-y-auto ${bodyClass}`;
    if (size === "small") classes += " md:w-[25%]";
    if (size === "medium") classes += " md:w-[40%]";
    if (size === "full") classes += " md:w-[80%]";
    else return classes;
  };
  React.useEffect(() => {
    document.addEventListener("keydown", handleEscEvent);
    () => document.removeEventListener("keydown", handleEscEvent);
  }, []);

  return (
    <div className="modal opacity-1 fixed w-full  h-full top-0 left-0 flex items-center justify-center bg-[#0000008c] z-50">
      <div
        className="modal-close absolute top-0 right-0 cursor-pointer flex flex-row items-center mt-4 mr-4 text-white text-sm z-50"
        onClick={onClose}
      >
        <svg
          className="fill-current text-white"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
        </svg>
        <span className="text-sm">(Esc)</span>
      </div>
      <div className={getBodyClasses()}>
        <div className="modal-content py-4 text-left px-4">
          {title && (
            <div className="flex justify-between items-center pb-[10px] border-b-2 border-dotted border-[#95ACAA]">
              <p className="text-[18px] font-medium text-[#000000]  w-[90%] ">
                {title}
              </p>
              <div className="cursor-pointer z-50" onClick={onClose}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.2806 14.2193C15.3502 14.289 15.4055 14.3717 15.4432 14.4628C15.4809 14.5538 15.5003 14.6514 15.5003 14.7499C15.5003 14.8485 15.4809 14.9461 15.4432 15.0371C15.4055 15.1281 15.3502 15.2109 15.2806 15.2806C15.2109 15.3502 15.1281 15.4055 15.0371 15.4432C14.9461 15.4809 14.8485 15.5003 14.7499 15.5003C14.6514 15.5003 14.5538 15.4809 14.4628 15.4432C14.3717 15.4055 14.289 15.3502 14.2193 15.2806L7.99993 9.06024L1.78055 15.2806C1.63982 15.4213 1.44895 15.5003 1.24993 15.5003C1.05091 15.5003 0.860034 15.4213 0.719304 15.2806C0.578573 15.1398 0.499512 14.949 0.499512 14.7499C0.499512 14.5509 0.578573 14.36 0.719304 14.2193L6.93962 7.99993L0.719304 1.78055C0.578573 1.63982 0.499512 1.44895 0.499512 1.24993C0.499512 1.05091 0.578573 0.860034 0.719304 0.719304C0.860034 0.578573 1.05091 0.499512 1.24993 0.499512C1.44895 0.499512 1.63982 0.578573 1.78055 0.719304L7.99993 6.93962L14.2193 0.719304C14.36 0.578573 14.5509 0.499512 14.7499 0.499512C14.949 0.499512 15.1398 0.578573 15.2806 0.719304C15.4213 0.860034 15.5003 1.05091 15.5003 1.24993C15.5003 1.44895 15.4213 1.63982 15.2806 1.78055L9.06024 7.99993L15.2806 14.2193Z"
                    fill="#95ACAA"
                  />
                </svg>
              </div>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
