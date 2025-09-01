import React from "react";

const FormField = ({ label, children, className = "" }) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-2 ${className}`}
    >
      <label className="text-sm font-medium text-gray-700 sm:w-1/3">
        {label}
      </label>
      <div className="sm:w-2/3">{children}</div>
    </div>
  );
};

export default FormField;
