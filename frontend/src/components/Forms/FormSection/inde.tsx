import React from "react";

const FormSection = ({ children, className = "" }) => {
  return (
    <div className={`grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 ${className}`}>
      {children}
    </div>
  );
};

export default FormSection;
