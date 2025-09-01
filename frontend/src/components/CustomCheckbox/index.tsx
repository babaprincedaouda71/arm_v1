import React from "react";

const CustomCheckbox = () => {
  return (
    <label className="relative flex items-center cursor-pointer">
      {/* Checkbox cachée */}
      <input type="checkbox" className="peer hidden" />
      {/* Apparence de la checkbox */}
      <div className="w-6 h-6 border border-gray-400 rounded-sm flex items-center justify-center peer-checked:bg-gradient-to-br peer-checked:from-purple-500 peer-checked:to-blue-500">
        {/* Icône de coche */}
        <svg
          className="w-4 h-4 text-white peer-checked:block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ display: "none" }} // Par défaut, caché
        >
          <path
            fillRule="evenodd"
            d="M9 16.2l-3.5-3.6a1 1 0 011.4-1.4L9 13.4l7.1-7.2a1 1 0 011.4 1.4l-8 8.2a1 1 0 01-1.4 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </label>
  );
};

export default CustomCheckbox;
