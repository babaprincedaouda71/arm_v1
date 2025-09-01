import * as React from "react";

const SelectField = ({ label, name, options, onChange }) => (
    <div className="flex items-center w-full">
      <label className="flex-[1] block text-sm font-medium text-gray-700">{label}</label>
      <select
      defaultValue={""}
        name={name}
        onChange={onChange}
        className="flex-[4] h-[48px] outline-none px-5 rounded-md bg-inputBgColor border-none shadow-sm"
      >
        <option value="" disabled>
          Choisir...
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="hover:bg-primary hover:bg-opacity-50">
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  export default SelectField