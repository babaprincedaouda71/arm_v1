// components/ModalButton.js
import React, { useState } from "react";
import Image from "next/image";
import FilterModal from "../FilterModal";

const ModalButton = ({ headers, visibleColumns, toggleColumnVisibility }) => {
  const [showModal, setShowModal] = useState(false);

  const handleToggleModal = () => setShowModal(!showModal);

  return (
    <div className="relative">
      {/* Bouton pour afficher/masquer la fenêtre modale */}
      <div className="flex">
        <button
          onClick={handleToggleModal}
          className="flex items-center md:p-0 gap-2 bg-gradient-to-b from-gradientBlueStart to-gradientBlueEnd mr-5 text-white rounded-lg"
        >
          <Image
            src="/images/checkboxes.svg"
            alt="My SVG"
            width={50}
            height={50}
            className="w-[48px] h-[48px] md:w-[50px] md:h-[50px]"
          />
        </button>
      </div>

      {/* Modale */}
      <FilterModal
        show={showModal}
        onClose={handleToggleModal}
        headers={headers}
        visibleColumns={visibleColumns}
        toggleColumnVisibility={toggleColumnVisibility}
      />
    </div>
  );
};

export default ModalButton;