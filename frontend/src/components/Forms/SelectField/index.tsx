import React, { useEffect, useRef, useState } from "react";

const SelectField = ({ label, name, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    setSelectedValue(option);
    setIsOpen(false);
    onChange({ target: { name, value: option } }); // Simule un événement onChange
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    // <div className="flex items-center w-full">
    //   <label className="flex-[1] block text-sm font-medium text-gray-700">
    //     {label}
    //   </label>
    //   <div
    //     className="relative flex-[4] border-none flex items-center w-full h-[48px] px-5 rounded-md bg-inputBgColor border border-gray-300 shadow-sm cursor-pointer"
    //     onClick={() => setIsOpen(!isOpen)}
    //   >
    //     <span className="flex-[9] text-center">
    //       {selectedValue || "Choisir..."}
    //     </span>
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       className={`flex-[1] w-4 h-4 transform transition-transform ${
    //         isOpen ? "rotate-180" : ""
    //       }`}
    //       fill="none"
    //       viewBox="0 0 24 24"
    //       stroke="currentColor"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M19 9l-7 7-7-7"
    //       />
    //     </svg>
    //     {isOpen && (
    //       <ul className="absolute top-[46px] right-0 z-10 text-center w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
    //         {options.map((option) => (
    //             <li
    //               key={option}
    //               className="col-span-11 pr-4 p-2 hover:bg-primary hover:bg-opacity-10 cursor-pointer"
    //               onClick={() => handleSelect(option)}
    //             >
    //               <span>{option}</span>
    //             </li>
    //         ))}
    //       </ul>
    //     )}
    //   </div>
    // </div>

    <div className="flex items-center w-full text-xs md:text-sm lg:text-base">
      <label className="flex-[1] block font-medium text-gray-700">
        {label}
      </label>
      <select
        defaultValue={""}
        name={name}
        onChange={onChange}
        className="flex-[4] h-[48px] outline-none px-5 rounded-md bg-inputBgColor border-none shadow-sm"
      >
        <option value="" disabled className="hover:bg-black">
          Choisir...
        </option>
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className=""
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
